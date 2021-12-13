const loginWrapper = document.querySelector('#login-wrapper');
const appIdInput = document.querySelector('#app_id');
const userIdInput = document.querySelector('#user_id');
const loginButton = document.querySelector('#login-button');
const callOptions = document.querySelector('#call-options');
const callUserButton = document.querySelector('#call-user');
const userToCallInput = document.querySelector('#user-to-call');
const callView = document.querySelector('#call-view');
const endCallButton = document.querySelector('#end-call');

var APP_ID, USER_ID, call, hasAnswered = false, retries = 0;
appIdInput.addEventListener('input', checkValidity)
userIdInput.addEventListener('input', checkValidity)
loginButton.addEventListener('click', login)
callUserButton.addEventListener('click', callUser)
endCallButton.addEventListener('click', endCall)

function checkValidity() {
  if (appIdInput.value && userIdInput.value) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

function login() {
  loginButton.disabled = true;
  APP_ID = appIdInput.value;
  USER_ID = userIdInput.value;

  SendBirdCall.init(APP_ID)
  SendBirdCall.setRingingTimeout(3)
  SendBirdCall.authenticate({ userId: USER_ID }, (result, error) => {
    if (error) {
      loginButton.disabled = false;
      console.error(error);
      return
    }
    appIdInput.removeEventListener('input', checkValidity);
    userIdInput.removeEventListener('input', checkValidity);
    loginButton.removeEventListener('input', login);
    loginWrapper.style.display = 'none';

    // Establishing websocket connection.
    SendBirdCall.connectWebSocket()
        .then(() => {
          callOptions.style.display = 'block'
        })
        .catch(/* Failed to connect */);
  });


}

function callUser() {
  retries++
  const userToCall = userToCallInput.value
  const dialParams = {
    userId: userToCall,
    isVideoCall: false,
    callOption: {
      remoteMediaView: document.getElementById('remote_audio'),
      audioEnabled: true,
    }
  };

  call = SendBirdCall.dial(dialParams, (call, error) => {
      if (error) {
          console.error(error)
      }
      callView.style.display = 'flex'
      callView.querySelector('#call-user-id').innerText = `Calling ${userToCall}...`
  });

  call.onConnected = (call) => {
    hasAnswered = true
  };

  call.onEnded = (call) => {
    const endResult = call._endResult
    call = null
    callView.style.display = 'none'

    if (hasAnswered || retries >= 3 || endResult !== "no_answer") {
      retries = 0
      hasAnswered = false
      return
    }
    setTimeout(() => {
      callUser()
    }, 1000)
  };
}

function endCall() {
  call.end()
  call = null
  hasAnswered = false;
  callView.style.display = 'none'
}