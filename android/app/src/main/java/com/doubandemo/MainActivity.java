package com.doubandemo;

import com.facebook.react.ReactActivity;
import com.rnfs.RNFSPackage;
import com.projectseptember.RNGL.RNGLPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "DoubanDemo";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }
    
    @Override
    protected String getJSBundleFile() {
        return CodePush.getBundleUrl();
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNFSPackage(),
            new RNGLPackage(),
            new CodePush("pp2HzSkyzSLmlX3e6loWQZXb3Wq_4ky-vHwQ-", this, BuildConfig.DEBUG)
        );
    }
}
