class FSM {
  /**
     * Creates new FSM instance.
     * @param config
     */
  constructor(config) {
    if (!config || !config.initial) {
      throw new Error("Wrong config");
    }
    this._config = config;
    this._state = config.initial;
    this._states = [];
    this._events = [];
    this._redoEvents = [];

    this.clearHistory();
  }

  /**
     * Returns active state.
     * @returns {String}
     */
  getState() {
    return this._state;
  }

  /**
     * Goes to specified state.
     * @param state
     */
  changeState(state) {
    if (this._config.states[state]) {
      this._state = state;
      this._states.push(state);
    } else {
      throw new Error("Wrong state");
    }
  }

  /**
     * Changes state according to event transition rules.
     * @param event
     */
  trigger(event, resetRedo = true) {
    let transitions = this._config.states[this._state].transitions;
    if (transitions && transitions[event]) {
      this.changeState(transitions[event]);
      this._events.push(event);
      if (resetRedo) {
        this._redoEvents = [];
      }
    } else {
      throw new Error("Error");
    }
  }

  redoTrigger(event) {
    let transitions = this._config.states[this._state].transitions;
    if (transitions && transitions[event]) {
      this.changeState(transitions[event]);
      this._events.push(event);
    } else {
      throw new Error("Error");
    }
  }

  /**
     * Resets FSM state to initial.
     */
  reset() {
    this.changeState(this._config.initial);
    this.clearHistory();
  }

  /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
  getStates(event) {
    let states = Object.keys(this._config.states);
    return event
      ? states.filter(state => this._config.states[state].transitions[event])
      : states;
  }

  /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
  undo() {
    let lastState = null;

    if (this._states.length > 1) {
      lastState = this._states.pop();
      this.changeState(this._states.pop());
      this._redoEvents.push(this._events.pop());
    }

    return !!lastState;
  }

  /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
  redo() {
    let lastEvent = null;

    if (this._redoEvents.length) {
      lastEvent = this._redoEvents.pop();
    }

    if (lastEvent) {
      this.trigger(lastEvent, false);
    }

    return !!lastEvent;
  }

  /**
     * Clears transition history
     */
  clearHistory() {
    this._states = [this._config.initial];
    this._events = [];
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
