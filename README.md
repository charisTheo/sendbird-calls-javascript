# sendbird-calls-javascript

> This sample is used only for calling another user - does not accept any incoming calls

## Install

```sh
npm i
```

## Run

```sh
npm start
```

## How to use

Once you have ran this sample app with `npm start`, open your web browser at [127.0.0.1:8080](http://127.0.0.1:8080/).

Then login into Sendbird Calls using your App ID and a user ID.

Once login was succefull, simply type the User ID you would like to call in the text input box and click the 'Call' button.
> You will have to have Sendbird Calls connected with the callee user ID in order to test receiving a call. As this demo cannot be used for receiving calls, it is suggested to use one of the following for the callee user: [Android app](https://play.google.com/store/apps/details?id=com.sendbird.calls.quickstart), [iOS app](https://apps.apple.com/us/app/sendbird-calls/id1503477603) or Sendbird Dashboard Calls Studio located at `https://dashboard.sendbird.com/<YOUR APP ID>/calls/studio/direct`.

The will try calling 3 times before hanging up for good - **_only if the calee didn't answer_**

You can change the ringing timeout through the `RINGING_TIMEOUT_SECONDS` variable inside `index.js`.
