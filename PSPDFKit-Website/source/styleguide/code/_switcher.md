[==

```swift
guard let input = InputStream(url: source), let output = OutputStream(url: target, append: false) else { throw RequestError.cantCreateStream }

input.open()
output.open()

defer {
    input.close()
    output.close()
}

let chunkSize = 1024
var buffer = [UInt8](repeating:0, count:chunkSize)

var bytesRead = input.read(&buffer, maxLength: chunkSize)
while bytesRead > 0 {
    let bytesWritten = output.write(buffer, maxLength: bytesRead)
    if bytesWritten != bytesRead {
        throw output.streamError ?? RequestError.streamWriteError
    }
    bytesRead = input.read(&buffer, maxLength: chunkSize)
}
```

```objc
NSInputStream *input = [NSInputStream inputStreamWithURL:fileURL];
NSOutputStream *output = [NSOutputStream outputStreamWithURL:targetURL append:NO];

[input open];
[output open];

NSInteger bytesRead = 0;
uint8_t buffer[1024] = { 0 };
while ((bytesRead = [input read:buffer maxLength:1024])) {
    if (bytesRead > 0) {
        [output write:buffer maxLength:bytesRead];
    } else {
        break;
    }
}

[input close];
[output close];
```

==]

[==

```kotlin
val document: PdfDocument = ...

// This code shouldn't run on main thread - alternatively use getFormFieldsAsync() to do this
// processing in RxJava chain.
val formFields = document.formProvider.formFields
formFields.filter { field -> field.type == FormType.TEXT }
            .forEach { field -> (field.formElement as TextFormElement).setText("Test ${field.name}") }
formFields.filter { field -> field.type == FormType.CHECKBOX }
            .forEach { field -> (field.formElement as CheckBoxFormElement).toggleSelection() }
```

```java
PdfDocument document = ...

// This code shouldn't run on main thread - alternatively use getFormFieldsAsync() to do this
// processing in RxJava chain.
List<FormField> formFields = document.getFormProvider().getFormFields();
for (FormField formField : formFields) {
    if (formField.getType() == FormType.TEXT) {
        TextFormElement textFormElement = (TextFormElement) formField.getFormElement();
        textFormElement.setText("Test " + textFormElement.getName());
    } else if (formField.getType() == FormType.CHECKBOX) {
        CheckBoxFormElement checkBoxFormElement = (CheckBoxFormElement)formField.getFormElement();
        checkBoxFormElement.toggleSelection();
    }
}
```

==]

[==

```es
// You can update the ViewState by calling `setViewState` with the new view state:
const viewState = instance.viewState;
instance.setViewState(viewState.set('showToolbar', false));

// Or by passing in an updater that receives the current ViewState as an argument:
instance.setViewState(viewState => viewState.zoomIn());

// This will NOT work because the ViewState is immutable.
instance.viewState.showToolbar = true;
instance.viewState.showToolbar; // => false
```

```js
// You can update the ViewState by calling `setViewState` with the new view state:
const viewState = instance.viewState;
instance.setViewState(viewState.set("showToolbar", false));

// Or by passing in an updater that receives the current ViewState as an argument:
instance.setViewState(function(viewState) {
  return viewState.zoomIn();
});

// This will NOT work because the ViewState is immutable.
instance.viewState.showToolbar = true;
instance.viewState.showToolbar; // => false
```

==]
