---
title: "Declarative Validation with Elixir"
description: "How to write custom data validation logic with Elixir."
preview_image: /images/blog/2020/declarative-validation-with-elixir/article-header.png
section: blog
author:
  - Claudio Ortolina
author_url:
  - https://twitter.com/cloud8421
date: 2020-01-01 8:00 UTC
tags: Web, Development, How-To, Elixir
published: true
secret: true
---

PSPDFKit Server is distributed as a Docker image, which is run by our customers on their own infrastructure. To support different modes of operation, it exposes a fairly extensive set of configuration options via environment variables.

Each environment variable value needs to be validated, and when it’s invalid, it needs to be categorized as one of the following:

- _error_ — the value _must_ be changed, as it stops the application from working as expected.
- _warning_ — the value _should_ be changed, but it allows the application to work.
- _deprecations_ — the value _will need_ to be changed, as it allows the application to work now, but it will stop working in a future version.

We recently started looking into improving the application component responsible for these validations to provide more precise and actionable feedback depending on how an invalid value is categorized.

In this blog post, we’ll look at a possible implementation of such a validator, which is responsible for finding and categorizing issues.

## Use Case

PSPDFKit Server exposes a management dashboard, which is protected behind a static username and password combination. Both values can be configured via environment variables.

Our constraints for these two values are:

- they’re required, so they _must_ be defined
- they _should_ be changed from their default values to provide better security

## General Architecture

The validator will receive a key-value structure (e.g. a map), with configuration names and values, and it should return a data structure that collects errors, warnings, and deprecations.

Validation rules should be expressed with a terse domain-specific language that favors composition so that additional rules can be layered on over time with minimal effort.

## Basic Validation

As a first attempt, we simply want to design a `validate/1` function that accepts a map of configuration options and returns uncategorized errors (if present).

To follow along, you can create a file called `config_validator.exs` and run it with `elixir config_validator.exs`.

We can start by writing out how our API could look:

```elixir
defmodule Config.Validator do
  @type reason :: String.t()
  @type result :: %{data: Enum.t(), errors: [reason()]}

  @spec validate(Enum.t()) :: result()
  def validate(data) do
    result = %{
      data: data,
      errors: []
    }

    result
    |> validate_key(:username, [required()])
    |> validate_key(:password, [required()])
  end
end

%{}
|> Config.Validator.validate()
|> IO.inspect()
```

The implementation relies on a `result` data structure, which is passed through a series of functions, each of which then applies one or more validators to a specific key in the included data.

A validator’s responsibility is to either let the result through unmodified or add a specific element to the `errors` list.

This design pushes toward predictable extension paths:

- To add a new validation to an existing key, add a new validator to the already existing list.
- To add validations for a new key, pipe the result through a new `validate_key/3` function call.

Implementing a validator requires defining a function that returns another function that can be used by `validate_key/3`.

We can implement `required/0` as:

```elixir
defp required do
  fn
    nil -> {:invalid, "is required"}
    _other -> :ok
  end
end
```

The returned function pattern matches the received value and returns a `{:invalid, "is required"}` tuple when it’s `nil`.

The implementation of `validate_key/3` requires finding the value of the specified key and then iterating over the passed validators, applying them to the value and adding relevant errors as needed:

```elixir
defp validate_key(initial_result, key, validators) do
  value = get_in(initial_result, [:data, key])

  Enum.reduce(validators, initial_result, fn validator, result ->
    case validator.(value) do
      :ok ->
        result

      {:invalid, reason} ->
        update_in(result, [:errors, key], fn
          nil -> [reason]
          other_reasons -> [reason | other_reasons]
        end)
    end
  end)
end
```

Running our file, we should see the following output:

```elixir
%{
  data: %{},
  errors: [password: ["is required"], username: ["is required"]]
}
```

## Adding a New Validator

We mentioned before that the username and password should be changed from their defaults so that we can write a validator that detects usage of default values:

```elixir
defp not_default(defaults) do
  fn value ->
    if value in defaults do
      {:invalid, "is a default and is not allowed"}
    else
      :ok
    end
  end
end
```

We could then use it as:

```elixir
# snip
result
|> validate_key(:username, [required(), not_default(["username"])])
|> validate_key(:password, [required(), not_default(["secret", "password"])])
# snip
```

At this point, we can run:

```elixir
%{username: "username"}
|> Config.Validator.validate()
|> IO.inspect()
```

And we should see:

```elixir
%{
  data: %{username: "username"},
  errors: [
    password: ["is required"],
    username: ["is a default and is not allowed"]
  ]
}
```

## Categorizing Validations

To support different error categories, we can extend the result map and extend the `validate_key/3` function to accept a category as argument. For example, to support warnings:

```elixir
def validate(data) do
  acc = %{
    data: data,
    errors: [],
    warnings: []
  }

  acc
  |> validate_key(:username, :errors, [required()])
  |> validate_key(:username, :warnings, [not_default(["username"])])
  |> validate_key(:password, :warnings, [required()])
  |> validate_key(:password, :warnings, [not_default(["secret"])])
end

defp validate_key(initial_acc, category, key, validators) do
  value = get_in(initial_acc, [:data, key])

  Enum.reduce(validators, initial_acc, fn validator, acc ->
    case validator.(value) do
      :ok ->
        acc

      {:invalid, reason} ->
        update_in(acc, [category, key], fn
          nil -> [reason]
          other_reasons -> [reason | other_reasons]
        end)
    end
  end)
end
```

To streamline the implementation in `validate/1`, we can create specialized `validate_as_error/3` and `validate_as_warning/3` functions, which would internally dispatch to `validate_key/4` as needed:

```elixir
defp validate_as_error(initial_acc, key, validators) do
  validate_key(initial_acc, :errors, key, validators)
end

defp validate_as_warning(initial_acc, key, validators) do
  validate_key(initial_acc, :warnings, key, validators)
end
```

Another implementation route (which is left as an exercise to the reader) is to revise the structure of validators and change it to a keyword list where each key is a category and the value is a list of validation functions for that very category.

The expected outcome of any implementation is to return the following:

```elixir
%{
  data: %{username: "username"},
  errors: [password: ["is required"]],
  warnings: [username: ["is a default and is not allowed"]]
}
```

## Richer Error Messages

Validation errors should return a more structured reason so that they can be consumed in different ways:

- Errors should be logged in the console, potentially as a summary and then with a longer explanation of what to do to fix them.
- Warnings can be displayed in the dashboard with a short description and then expanded into a long description.

For example, the `required()` validator can be extended as:

```elixir
defp required do
  reason = %{
    type: :required,
    short_desc: "The value is required, please include it in your configuration",
    long_desc: """
    The value is required as PSPDFKit Server is not able to use a default value.
    Please update your configuration and try again.
    """
  }
  fn
    nil -> {:invalid, reason}
    _other -> :ok
  end
end
```

As we rely on the shape of this error, it also makes sense to define a struct for it rather than use a literal map:

```elixir
defmodule Config.Validator.Error do
  defstruct [:type, :short_desc, :long_desc]
end
```

## Conclusion

In this blog post, we looked at how it’s possible to design and implement a completely custom validation system — starting from a few carefully chosen primitives — in order to have maximum flexibility on how errors are reported to the end user.

It’s worth mentioning that the Elixir ecosystem already offers quality data validation libraries with distinctive feature sets which may fit your use case. Some examples include [Ecto][] (via `Ecto.Changeset` and `Ecto.Schema`), [Saul][], and [Norm][]. As always, some initial research before writing any code can help you make a well-informed decision on how to proceed.

[ecto]: https://hex.pm/packages/ecto
[saul]: https://hex.pm/packages/saul
[norm]: https://hex.pm/packages/norm
