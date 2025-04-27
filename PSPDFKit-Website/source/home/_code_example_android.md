[==

```kotlin
// Simply launch your PDF activity like any other activity.
context.startActivity(PdfActivityIntentBuilder.fromUri(context, uri)
    .activityClass(MyPdfActivity::class.java)
    .build())

// Reuse and extend our powerful PdfActivity base class.
class MyPdfActivity : PdfActivity() {
    override fun onGenerateMenuItemIds(menuItems: MutableList<Int>) = menuItems.apply {
        add(R.id.approve_document)
    }

    override fun onCreateOptionsMenu(menu: Menu) = super.onCreateOptionsMenu(menu).apply {
        menu.findItem(R.id.approve_document).apply {
            title = "Approve Document"
            setOnMenuItemClickListener placeApprovedStamp@ {
                val pageIndex = 0
                val boundingBox = RectF(0f, 40f, 150f, 0f)
                val selectAnnotationAfterAdding = false
                fragment?.addAnnotationToPage(StampAnnotation(pageIndex, boundingBox, StampType.APPROVED), selectAnnotationAfterAdding)
                return@placeApprovedStamp true
            }
        }
    }
}
```

```java
// Simply launch your PDF activity like any other activity.
context.startActivity(PdfActivityIntentBuilder.fromUri(context, uri)
    .activityClass(MyPdfActivity.class)
    .build());

// Reuse and extend our powerful PdfActivity base class.
public class MyPdfActivity extends PdfActivity {
    @Override public List<Integer> onGenerateMenuItemIds(@NonNull List<Integer> menuItems) {
        menuItems.add(R.id.approve_document);
        return menuItems;
    }

    @Override public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);

        final MenuItem approveDocumentItem = menu.findItem(R.id.approve_document);
        approveDocumentItem.setTitle("Approve Document");
        approveDocumentItem.setIcon(R.drawable.ic_approve);
        approveDocumentItem.setOnMenuItemClickListener(menuItem -> {
            final int pageIndex = 0;
            final RectF boundingBox = new RectF(0f, 40f, 150f, 0f);
            final StampAnnotation approvedStamp = new StampAnnotation(pageIndex, boundingBox, StampType.APPROVED);
            getPdfFragment().addAnnotationToPage(approvedStamp, false);
            return false;
        });

        return true;
    }
}
```

==]
