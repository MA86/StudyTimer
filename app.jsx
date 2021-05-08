class App extends React.Component {
  constructor(props) {
    super(props);
    // Variables that need to be rendered after chanage
    this.state = {
      break: 5,
      session: 25,
      minutesSes: 25,
      secondsSes: 0,
      minutesBr: 5,
      secondsBr: 0,
      label: "Session",
      icon: (
        <span className="material-icons google-icon">play_circle_outline</span>
      )
    };
    // Variables not used in rendering
    this.sessionFlag = true;
    this.breakFlag = false;
    this.interval = null;
    this.paused = true;
    this.audio = null;

    this.handleBreakIncrement = this.handleBreakIncrement.bind(this);
    this.handleBreakDecrement = this.handleBreakDecrement.bind(this);
    this.handleSessionDecrement = this.handleSessionDecrement.bind(this);
    this.handleSessionIncrement = this.handleSessionIncrement.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleTimer = this.handleTimer.bind(this);
  }

  handleBreakIncrement() {
    if (this.state.break < 60) {
      this.setState({
        break: this.state.break + 1,
        minutesBr: this.state.break + 1
      });
    }
  }

  handleBreakDecrement() {
    if (this.state.break > 1) {
      this.setState({
        break: this.state.break - 1,
        minutesBr: this.state.break - 1
      });
    }
  }

  handleSessionIncrement() {
    if (this.state.session < 60) {
      this.setState({
        session: this.state.session + 1,
        minutesSes: this.state.session + 1
      });
    }
  }

  handleSessionDecrement() {
    if (this.state.session > 1) {
      this.setState({
        session: this.state.session - 1,
        minutesSes: this.state.session - 1
      });
    }
  }

  // Stop timer, reset to defaults
  handleReset() {
    clearInterval(this.interval);

    this.setState({
      break: 5,
      session: 25,
      minutesSes: 25,
      secondsSes: 0,
      minutesBr: 5,
      secondsBr: 0,
      label: "Session",
      icon: (
        <span className="material-icons google-icon">play_circle_outline</span>
      )
    });
    this.sessionFlag = true;
    this.breakFlag = false;
    this.interval = null;
    this.paused = true;

    this.audio.pause();
    this.audio.currentTime = 0;
  }

  componentDidMount() {
    this.audio = document.getElementById("beep");
  }

  // Play and pause
  handleTimer() {
    if (this.paused == true) {
      this.paused = false;
      this.setState(function () {
        return {
          icon: <span className="material-icons google-icon">pause</span>
        };
      });
    } else if (this.paused == false) {
      this.paused = true;
      this.setState(function () {
        return {
          icon: (
            <span className="material-icons google-icon">
              play_circle_outline
            </span>
          )
        };
      });
    }

    let appPointer = this;

    if (this.paused == false) {
      // Run break and session
      this.interval = setInterval(function () {
        // Session countdown
        let sessionInSeconds =
          appPointer.state.minutesSes * 60 + appPointer.state.secondsSes;
        if (appPointer.sessionFlag && sessionInSeconds > 0) {
          appPointer.setState({
            minutesSes: Math.floor((sessionInSeconds - 1) / 60),
            secondsSes: (sessionInSeconds - 1) % 60
          });
        }
        // Break countdown
        let breakInSeconds =
          appPointer.state.minutesBr * 60 + appPointer.state.secondsBr;
        if (appPointer.breakFlag && breakInSeconds > 0) {
          appPointer.setState({
            minutesBr: Math.floor((breakInSeconds - 1) / 60),
            secondsBr: (breakInSeconds - 1) % 60
          });
        }
        // If session is zero, start break
        if (sessionInSeconds == 0) {
          appPointer.breakFlag = true;
          appPointer.sessionFlag = false;
          appPointer.audio.play();
          appPointer.setState({
            label: "Break",
            minutesSes: appPointer.state.session
          });
        }
        // If break is zero, start session
        if (breakInSeconds == 0) {
          appPointer.sessionFlag = true;
          appPointer.breakFlag = false;
          appPointer.audio.play();
          appPointer.setState({
            label: "Session",
            minutesBr: appPointer.state.break
          });
        }
      }, 1000);
    }
    if (this.paused == true) {
      clearInterval(this.interval);
    }
  }

  render() {
    var minutes;
    var seconds;
    if (this.sessionFlag) {
      minutes = this.state.minutesSes.toString();
      seconds = this.state.secondsSes.toString();
      if (minutes.length < 2) {
        minutes = "0" + minutes;
      }
      if (seconds.length < 2) {
        seconds = "0" + seconds;
      }
    }
    if (this.breakFlag) {
      minutes = this.state.minutesBr.toString();
      seconds = this.state.secondsBr.toString();
      if (minutes.length < 2) {
        minutes = "0" + minutes;
      }
      if (seconds.length < 2) {
        seconds = "0" + seconds;
      }
    }
    return (
      <div id="background-div">
        <div id="app-div" className="animate__animated animate__rollIn">
          <div id="br-ses-div">
            <Break
              break={this.state.break}
              handleBD={this.handleBreakDecrement}
              handleBI={this.handleBreakIncrement}
            />
            <Session
              session={this.state.session}
              handleSD={this.handleSessionDecrement}
              handleSI={this.handleSessionIncrement}
            />
          </div>
          <Timer
            minutes={minutes}
            seconds={seconds}
            handleReset={this.handleReset}
            handleTimer={this.handleTimer}
            label={this.state.label}
            icon={this.state.icon}
          />
        </div>
      </div>
    );
  }
}

class Break extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="br-margin">
        <h1 id="break-label" className="regular-font">
          Break Length
        </h1>
        <button id="break-increment" onClick={this.props.handleBI}>
          <span className="material-icons google-icon">expand_less</span>
        </button>
        <h2 id="break-length" className="regular-font">
          {this.props.break}
        </h2>
        <button id="break-decrement" onClick={this.props.handleBD}>
          <span className="material-icons google-icon">expand_more</span>
        </button>
      </div>
    );
  }
}

class Session extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="ses-margin">
        <h1 id="session-label" className="regular-font">
          Session Length
        </h1>
        <button id="session-increment" onClick={this.props.handleSI}>
          <span className="material-icons google-icon">expand_less</span>
        </button>
        <h2 id="session-length" className="regular-font">
          {this.props.session}
        </h2>
        <button id="session-decrement" onClick={this.props.handleSD}>
          <span className="material-icons google-icon">expand_more</span>
        </button>
      </div>
    );
  }
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="timer-div">
        <h1 id="timer-label" className="regular-font">
          {this.props.label}
        </h1>
        <div id="time-left-div">
          <h1
            id="time-left"
            className="special-font"
          >{`${this.props.minutes}:${this.props.seconds}`}</h1>
        </div>
        <div>
          <button id="start_stop" onClick={this.props.handleTimer}>
            {this.props.icon}
          </button>
          <button id="reset" onClick={this.props.handleReset}>
            <span className="material-icons google-icon">replay</span>
          </button>
        </div>
        <audio id="beep">
          <source
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
            type="audio/wav"
          />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }
}

// Virtual DOM //
ReactDOM.render(<App />, document.getElementById("app"));

