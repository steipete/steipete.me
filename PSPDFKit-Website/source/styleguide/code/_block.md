```sh
bash "$BUILT_PRODUCTS_DIR/$FRAMEWORKS_FOLDER_PATH/PSPDFKit.framework/strip-framework.sh"
```

```build.gradle
android {
    compileSdkVersion 25
    buildToolsVersion '25.0.2'

    defaultConfig {
        applicationId "com.example.app"
        minSdkVersion 16
        targetSdkVersion 25
    }
}
```
