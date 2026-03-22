const { withAppBuildGradle } = require("@expo/config-plugins");

/* 
  Plugin to increase object max path length in windows to support long path names, otherwise it doesn't build.
  Maybe need to modify registry. 
  Powershell: Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Type DWord -Value 1
  And copy ninja.exe to the look up path
  from: %ANDROID_SDK_ROOT%\cmake\<version>\bin\ninja.exe (Get-ChildItem "$env:LOCALAPPDATA\Android\Sdk\cmake" -Recurse -Filter ninja.exe)
  to: %USERPROFILE%\.gradle\daemon\9.0.0\ninja.exe
*/

const injectMaxPathArgs = (src) => {
  if (
    src.includes("CMAKE_MAKE_PROGRAM") ||
    src.includes("CMAKE_OBJECT_PATH_MAX")
  ) {
    return src;
  }

  const needle = "defaultConfig {";
  const inject = `
    defaultConfig {
        externalNativeBuild {
            cmake {
                arguments "-DCMAKE_MAKE_PROGRAM=ninja.exe", "-DCMAKE_OBJECT_PATH_MAX=1024"
            }
        }`;

  return src.replace(needle, inject);
};

const withCmakeObjectPathMax = (config) =>
  withAppBuildGradle(config, (gradleConfig) => {
    gradleConfig.modResults.contents = injectMaxPathArgs(
      gradleConfig.modResults.contents,
    );
    return gradleConfig;
  });

module.exports = withCmakeObjectPathMax;

