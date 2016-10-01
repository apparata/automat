import Foundation

/// Example:
/// ```
/// let stateMachine = __CLASSNAME__(initialState: .__FIRSTSTATE__)
/// stateMachine.didTransition = { from, event, to in
///     print("\(from) -\(event)-> \(to)")
/// }
/// stateMachine.fire(event: .__FIRSTEVENT__)
/// ```
public class __CLASSNAME__ {
    
    public enum Error: Swift.Error {
        case illegalTransition(from: State, event: Event)
    }
    
    public enum State {
        __STATES__
    }
    
    public enum Event {
        __EVENTS__
    }

    private typealias Transition = (from: State, event: Event, to: State)
    
    public typealias TransitionHandler = (_ from: State, _ event: Event, _ to: State) -> Void

    /// Called right after a transition has been made.
    public var didTransition: (TransitionHandler)?
    
    /// The current state of the state machine.
    public private(set) var state: State
    
    /// Initializes the state machine with an initial state.
    ///
    /// - parameter initialState: The initial state of the state machine.
    public init(initialState: State) {
        state = initialState
    }
    
    /// Fire an event which may result in a state transition.
    ///
    /// - parameter event: Event to fire.
    /// 
    /// - returns: `true` if transition was made. `false` otherwise.
    @discardableResult public func fire(event: Event) -> Bool {
        guard let transition = __CLASSNAME__.validatedTransition(from: state, event: event) else {
            return false
        }
        make(transition)
        return true
    }
    
    /// Fire an event which results in either a state transition or a thrown error.
    ///
    /// - parameter event: Event to fire.
    ///
    /// - throws: `StateMachine.Error` if the transition is illegal.
    public func fireStrict(event: Event) throws {
        guard let transition = __CLASSNAME__.validatedTransition(from: state, event: event) else {
            throw Error.illegalTransition(from: state, event: event)
        }
        make(transition)
    }
    
    private static func validatedTransition(from: State, event: Event) -> Transition? {
        guard let to = transitionDestination(from: from, event: event) else {
            return nil
        }
        return (from: from, event: event, to: to)
    }
    
    private static func transitionDestination(from: State, event: Event) -> State? {
        switch from {
        __TRANSITIONS__
            
        default:
            break
        }
        
        return nil
    }
    
    private func make(_ transition: Transition) {
        state = transition.to
        didTransition?(transition.from, transition.event, transition.to)
    }
}

extension __CLASSNAME__: CustomStringConvertible {
    public var description: String {
        return "<__CLASSNAME__(state=\(state))>"
    }
}
