var APP_ID, USER_ID, call, retries = 0, RINGING_TIMEOUT_SECONDS = 30;

const loginWrapper = document.querySelector('#login-wrapper');
const appIdInput = document.querySelector('#app_id');
const userIdInput = document.querySelector('#user_id');
const loginButton = document.querySelector('#login-button');
const callOptions = document.querySelector('#call-options');
const callUserButton = document.querySelector('#call-user');
const userToCallInput = document.querySelector('#user-to-call');
const callView = document.querySelector('#call-view');
const endCallButton = document.querySelector('#end-call');

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
  SendBirdCall.setRingingTimeout(RINGING_TIMEOUT_SECONDS)
  SendBirdCall.authenticate({ userId: USER_ID }, (result, error) => {
    if (error) {
      loginButton.disabled = false;
      alert(`Failed to authenticate. Error: ${error}`)
      return
    }
    appIdInput.removeEventListener('input', checkValidity);
    userIdInput.removeEventListener('input', checkValidity);
    loginButton.removeEventListener('input', login);
    loginWrapper.style.display = 'none';

    // Establishing websocket connection after authenticating
    SendBirdCall.connectWebSocket()
      .then(() => {
        callOptions.style.display = 'block'
      })
      .catch((error) => {
        alert(`Failed to connect websocket. Error: ${error}`)
      });
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
      alert(`Failed to call. Error: ${error}`)
    }
    callView.style.display = 'flex'
    callView.querySelector('#call-user-id').innerHTML = `<div>Calling ${userToCall}...</div><div>Times tried calling: ${retries}</div>`
  });

  call.onEnded = (call) => {
    const endResult = call._endResult
    call = null

    if (retries >= 3 || endResult !== "no_answer") {
      callView.style.display = 'none'
      retries = 0
      return
    }

    // Retry if no answer
    setTimeout(() => {
      callUser()
    }, 1000)
  };
}

// User has manually ended the call
function endCall() {
  call.end()
  call = null
  retries = 0
  callView.style.display = 'none'
}