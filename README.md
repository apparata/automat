# automat

![license](https://img.shields.io/badge/license-MIT-blue.svg)

Generated code:

![language Swift 3](https://img.shields.io/badge/language-Swift%203-orange.svg) ![platform iOS macOS tvOS](https://img.shields.io/badge/platform-iOS%20%7C%20tvOS%20%7C%20macOS-lightgrey.svg) ![license](https://img.shields.io/badge/license-Public%20Domain-blue.svg)

Interactive web tool for generating Swift state machine code by drawing a state diagram. Access the tool directly in your web browser here: https://apparata.github.io/automat

The generated code is public domain and free to use in any type of project. No attribution or anything needed.

The tool itself is released under the MIT license.

NOTE: This version is usable, but the project is still in its infancy, so it's not incredibly robust.


## Example

![Example State Machine](example.png)

The diagram above would result in a state machine with generated state and event enums in Swift. It could be used in the following way:

```swift
let stateMachine = StateMachine(initialState: .ready)

stateMachine.didTransition = { from, event, to in
    // This is where you would act on transitions.
     print("\(from) -\(event)-> \(to)")
}

// Trigger a transition to the .loading state from the .ready state.
stateMachine.fire(event: .load)
```

The public interface would look like this:

```swift
public class StateMachine {
    
    public enum Error: Swift.Error {
        case illegalTransition(from: State, event: Event)
    }
    
    public enum State {
        case ready
        case loading
        case processing
        case failed
        case finished
    }
    
    public enum Event {
        case load
        case madeProgress
        case gotResponse
        case fail
        case finish
        case retry
        case finish
    }
    
    public typealias TransitionHandler = (_ from: State, _ event: Event, _ to: State) -> Void

    /// Called right after a transition has been made.
    public var didTransition: TransitionHandler?
    
    /// The current state of the state machine.
    public private(set) var state: State
    
    /// Initializes the state machine with an initial state.
    ///
    /// - parameter initialState: The initial state of the state machine.
    public init(initialState: State)
    
    /// Fire an event which may result in a state transition.
    ///
    /// - parameter event: Event to fire.
    /// 
    /// - returns: `true` if transition was made. `false` otherwise.
    @discardableResult public func fire(event: Event) -> Bool
    
    /// Fire an event which results in either a state transition or a thrown error.
    ///
    /// - parameter event: Event to fire.
    ///
    /// - throws: `StateMachine.Error` if the transition is illegal.
    public func fireStrict(event: Event) throws
}
```
