---
title: "Leveraging SQLite Full-Text Search on iOS"
description: "We look at SQLite’s FTS extension and how you can use it to add high performance search to your app."
preview_image: /images/blog/2018/leveraging-sqlite-full-text-search-on-ios/article-header.png
section: blog
author:
  - Aditya Krishnadevan
author_url:
  - https://twitter.com/caughtinflux
date: 2018-03-22 10:00 UTC
tags: iOS, Development, SQLite
published: true
---

Full-text search is an SQLite extension containing two modules — ([`fts3/4`][FTS3/4 Official DocPage] and [`fts5`][FTS5 Official DocPage]) — that can be enabled by passing in the requisite compile-time flags. FTS1 and FTS2 are deprecated and have known issues, and SQLite developers do not recommend using them.

The FTS3/4 and FTS5 modules allow the creation of a [virtual table](https://sqlite.org/vtab.html) that can contain large amounts of text and allow users to perform quick and complex searches across the entire dataset. In our [SDK][PSPDFKit SDK page], we leverage this to build our [indexed full-text search component][PSPDFKit Indexed FTS].

Using the SQLite version bundled with iOS is pretty simple: You just add `libsqlite3.dylib` to the appropriate target in your app and import `sqlite3/sqlite3.h` wherever you require these APIs.

## Creating and Querying an FTS Table via the C API

Creating a virtual table via the C API is pretty simple:

```c
// First, we open the database connection.
sqlite3* db = NULL;
int ret = sqlite3_open([NSTemporaryDirectory() stringByAppendingPathComponent:@"test.db"].UTF8String, &db);
NSAssert(ret == SQLITE_OK, @"Failed to create database connection");

// We then create the new table.
ret = sqlite3_exec(db, "CREATE VIRTUAL TABLE IF NOT EXISTS ftsTable USING fts5(stringId, text, tokenize='unicode61')", NULL, NULL, NULL);
NSAssert(ret == SQLITE_OK, @"Failed to create table");

// Next we populate the table with some data.
sqlite3_stmt* statement = NULL;
const char* sql ="INSERT OR REPLACE INTO ftsTable (stringId, text) VALUES (?, ?)";
ret = sqlite3_prepare_v2(db, sql, (int)strlen(sql), &statement, NULL);
NSAssert(ret == SQLITE_OK, @"Failed to create prepared statement");

// Text length is hardcoded here, but do not do this in production!
sqlite3_bind_text(statement, 1, "uniqueid_1", 10, NULL);
sqlite3_bind_text(statement, 2, "Some great text", 15, NULL);

sqlite3_step(statement);

sqlite3_reset(statement);
sqlite3_bind_text(statement, 1, "uniqueid_2", 10, NULL);
sqlite3_bind_text(statement, 2, "PSPDFKit is a fantastic framework", 33, NULL);
sqlite3_step(statement);
```

For the full syntax, see the [FTS3][FTS3 Create Table] or [FTS5][FTS5 Create Table] documentation.

Querying an FTS table is the same for simple queries for both FTS3/4 and FTS5:

```c
sqlite3_stmt* queryStatement;
const char* selectionSql = "SELECT DISTINCT stringId FROM ftsTable WHERE text MATCH ?";
ret = sqlite3_prepare_v2(db, selectionSql, (int)strlen(selectionSql), &queryStatement, NULL);
NSAssert(ret == SQLITE_OK, @"Failed to create prepared statement");
ret = sqlite3_bind_text(queryStatement, 1, "fantastic", 9, NULL);
NSAssert(ret == SQLITE_OK, @"Failed to bind statement");

sqlite3_step(queryStatement);

const int resultSize = sqlite3_column_bytes(queryStatement, 0);
char *columnText = (char *)calloc(1, resultSize);
strncpy(columnText, (const char *)sqlite3_column_text(queryStatement, 0), resultSize);

NSLog(@"Matching identifier: %s", columnText); // Logs "Matching identifier: uniqueid_2"

free(columnText);
```

The FTS query to the right of the `MATCH` operator is pretty powerful, and it should be able to accommodate all your needs. The SQLite website [documents this well][MATCH syntax]. Note that it isn’t strictly necessary to use `MATCH` when querying an FTS table. A `LIKE` expression works as well but is much slower.


## Customizability of FTS

FTS3 and FTS4 are nearly identical. They share most of their code with each other, and their interfaces are the same. For the purposes of this article, we’re only considering FTS4 and FTS5.

When inserting data into an FTS table, SQLite runs the text through an algorithm called the [“tokenizer.”][FTS3 Tokenizer] Unless a specific tokenizer is specified as part of the `CREATE VIRTUAL TABLE` statement used to create the FTS table, the default tokenizer “simple” is used. This tokenizer simply converts input text into terms by lowercasing all the text and using the `ASCII` space as the delimiter. All code points in the text outside of ASCII (129 and higher) are discarded.

This is why the examples below all use the newer `unicode61` tokenizer, which accepts most Unicode characters and uses Unicode’s case-folding algorithm, while also recognizing more than just the ASCII space character for separating terms. SQLite also offers ICU tokenizers (if enabled at compile), which can work with specific languages.

The `porter` tokenizer is a very useful “wrapper” tokenizer that is a part of SQLite. [As explained at sqlite.org][Tokenizer explanation]:

> This tokenizer uses the same rules to separate the input text into terms including folding all terms into lower case, but also uses the [Porter Stemming algorithm] to reduce related English language words to a common root. For example, using the same input document as in the paragraph above, the porter tokenizer extracts the following tokens: “right now thei veri frustrat”. Even though some of these terms are not even English words, in some cases using them to build the full-text index is more useful than the more intelligible output produced by the simple tokenizer. Using the porter tokenizer, the document not only matches full-text queries such as “MATCH 'Frustrated'”, but also queries such as “MATCH 'Frustration'”, as the term “Frustration” is reduced by the [Porter Stemming algorithm] to “frustrat” - just as “Frustrated” is. So, when using the porter tokenizer, FTS is able to find not just exact matches for queried terms, but matches against similar English language terms.

At PSPDFKit, we use SQLite’s custom tokenizer API to create a Porter tokenizer that also works well with CJK characters, as they are not something the bundler tokenizer can handle.

## Differences between FTS3/4 and FTS5

In earlier versions of FTS5 (like the one bundled with iOS 11), it was not possible to correctly filter a query’s results to a particular column, but that has since been rectified.

Overall, the FTS5 module has much better performance than its predecessors. However, it is missing some functionality when compared to FTS4, in that the auxiliary functions to extract information about matches aren’t as fully featured. Functions like `matchinfo()` and `offsets()` do not exist, and the `snippet()` function is not as useful as in FTS4.

Since we relied on FTS4’s `offsets()` function in our framework, we turned to FTS5’s [auxiliary function API][FTS5 Aux Function API] to implement it ourselves. Here’s a quick sample of how to use the API:

```c

void offsets(const Fts5ExtensionApi* api, Fts5Context* ftsContext, sqlite3_context* sqlite3Context,
             int numberOfArguments, sqlite3_value** arguments) {
    // Implement your function here.
}

/// From https://sqlite.org/fts5.html
fts5_api* fts5APIFromDB(sqlite3* db) {
    fts5_api* pRet = 0;
    sqlite3_stmt* pStmt = 0;
// Disable the sizeof(pRet) call in clang analyzer because we actually want the size of a pointer.
#ifndef __clang_analyzer__
    if (SQLITE_OK == sqlite3_prepare_v2(db, "SELECT fts5()", -1, &pStmt, 0) && SQLITE_ROW == sqlite3_step(pStmt) &&
        sizeof(pRet) == sqlite3_column_bytes(pStmt, 0)) {
        memcpy(&pRet, sqlite3_column_blob(pStmt, 0), sizeof(pRet));
    }
#endif
    sqlite3_finalize(pStmt);
    return pRet;
}

int addFTS5OffsetsFunction(sqlite3* db) {
    fts5_api* api = fts5APIFromDB(db);
    int rc = SQLITE_FAIL;
    if (!api) {
        // Handle failure.
        return rc;
    }
    // This creates an auxiliary function called pdfc_offsets which is callable within an FTS5 query.
    // When called, it calls the `offsets` function defined by us.
    rc = api->xCreateFunction(api, "pdfc_offsets", NULL, offsets, NULL);
    return rc;
}
```

## Checking If FTS Is Enabled

PSPDFKit for iOS supports using a customer-specified SQLite version, which we achieve by not hardlinking to SQLite and instead finding the symbols at runtime. This makes it important to know which version of FTS the customer’s SQLite supports. The best way to check
this is to use the `sqlite3_compileoption_used()` function:

```objc
BOOL fts4Enabled = (sqlite3_compileoption_used("ENABLE_FTS3") && sqlite3_compileoption_used("ENABLE_FTS3_PARENTHESIS"));
BOOL fts5Enabled = sqlite3_compileoption_used("ENABLE_FTS5");
```

However, if you’re working with an SQLite version that has modules enabled and FTS is added to a connection, checking the compile options is not enough. In this case, attempt to create a temporary FTS table, like so:

```objc
sqlite3* db = NULL;
sqlite3_open(":memory:", &db);
int returnCode = sqlite3_exec(db, "CREATE VIRTUAL TABLE ftsTable USING fts5(stringId, text, tokenize='unicode61')", NULL, NULL, NULL);
BOOL fts5Enabled = returnCode == SQLITE_OK;
sqlite3_close(db);

sqlite3_open(":memory:", &db);
returnCode = sqlite3_exec(db, "CREATE VIRTUAL TABLE ftsTable USING fts4(stringId, text, tokenize='unicode61')", NULL, NULL, NULL);
BOOL fts4Enabled = returnCode == SQLITE_OK;
sqlite3_close(db);
```

## Limitations

A major limitation when using FTS tables with the Porter tokenizer is that you lose the ability to match words or phrases exactly. You can create a workaround by using SQL’s `LIKE` predicate in a query, but this is significantly slower than using FTS’s `MATCH`. Another alternative would be to create a separate table that uses a non-Porter tokenizer. This is just another tradeoff between size and speed that you have to make based on what sort of data is being stored in the database.

Additionally, another issue arises when debugging custom tokenizers: You can’t simply play around with them from a console, since they need to be loaded into SQLite via its programmatic API.

From iOS 11 onward, the watchdog is very proactive in killing apps that peg the CPU at higher usage for extended periods of time. Since the amount of CPU time afforded to an app varies on factors like the device, battery level, temperatures, and so on, there’s no simple point at which long-running CPU-intensive work can be paused.

By nature, our [indexed full-text search][PSPDFKit Indexed FTS] feature performs this sort of work, which is why we introduced a “cool down timer” to [`PSPDFLibrary`], which is controlled via the [`automaticallyPausesLongRunningTasks`][PSPDFLibrary Cooldown Property] property.

When `YES`, [`PSPDFLibrary`] automatically pauses indexing if it has been running for a certain amount of time, and it resumes after about 30 seconds. If you expect your indexing operations to be long-running, you should consider implementing something similar in your own app.

[PSPDFKit SDK page]: https://pspdfkit.com/pdf-sdk/
[FTS3/4 Official DocPage]: https://www.sqlite.org/fts3.html#introduction_to_fts3_and_fts4
[FTS5 Official DocPage]: https://www.sqlite.org/fts5.html
[PSPDFKit Indexed FTS]: https://pspdfkit.com/pdf-sdk/ios/indexed-search/
[FTS3 Create Table]: https://www.sqlite.org/fts3.html#creating_and_destroying_fts_tables
[FTS5 Create Table]: https://sqlite.org/fts5.html#fts5_table_creation_and_initialization
[`PSPDFLibrary`]: https://pspdfkit.com/api/ios/Classes/PSPDFLibrary.html
[PSPDFLibrary Cooldown Property]: https://pspdfkit.com/api/ios/Classes/PSPDFLibrary.html#/c:objc(cs)PSPDFLibrary(py)automaticallyPauseLongRunningTasks
[MATCH Syntax]: https://www.sqlite.org/fts3.html#full_text_index_queries
[FTS3 Tokenizer]: https://www.sqlite.org/fts3.html#tokenizer
[Porter Stemming algorithm]: http://tartarus.org/~martin/PorterStemmer/
[FTS5 Aux Function API]: https://sqlite.org/fts5.html#_custom_auxiliary_functions_api_reference_
[Tokenizer explanation]: https://www.sqlite.org/fts3.html
