import type { Options as ConfettiOptions } from 'canvas-confetti'
import { config } from './config'
import { Events } from './enums'
import type { GamepadMap, ButtonState } from './types'

const GAMEPADCONNECTED = 'gamepadconnected'
const GAMEPADDISCONNECTED = 'gamepaddisconnected'
const KEYDOWN = 'keydown'

/**
 * @class CheatCode
 * @description A general purpose class to listen for user input (cheat codes) and act on them.
 * @link https://dev.to/alvaromontoro/develop-a-rock-band-game-with-html-and-javascript-in-10-minutes-26kc
 */
export default class CheatCode {
	pattern: string
	eventType: Events
	timeLimit: number
	duration: number
	confettiOptions: ConfettiOptions

	gamepads: GamepadMap = {}
	buttonState: ButtonState = {}

	entries: Array<string | number> = []
	lastEntryTime: number = this.now
	timer: ReturnType<typeof setInterval> = 0

	constructor(
		pattern = config.codes.konami,
		eventType = Events.Keyboard,
		timeLimit = config.timeLimit,
		duration = config.duration,
		confettiOptions = config.confettiOptions
	) {
		this.pattern = pattern
		this.eventType = eventType
		this.timeLimit = timeLimit
		this.duration = duration
		this.confettiOptions = confettiOptions

		this.gamepadConnected = this.gamepadConnected.bind(this)
		this.init = this.init.bind(this)
	}

	/** Current date at call time. */
	private get now(): number {
		return Date.now()
	}

	/** The set of entries currently in the queue. */
	private get currentCode(): string {
		return this.entries.join(' ')
	}

	/** List of indexes per connected gamepad. */
	private get gamepadIndexes() {
		return Object.keys(this.gamepads)
	}

	/** Gamepads connected to the device at the time. */
	private get connectedGamepads() {
		return navigator.getGamepads()
	}

	/** Compare right now to the last time an entry was recorded and the allotted time limit. */
	private checkTime(): void {
		if (this.now - this.lastEntryTime > this.timeLimit) {
			this.entries = []
		}
	}

	/** Compare the total entries to the required pattern to determine if it's been entered. */
	private checkCode(event: KeyboardEvent): void {
		const { key } = event

		this.entries.push(key)
		this.lastEntryTime = this.now

		if (this.currentCode === this.pattern) {
			this.loadConfetti()
		}
	}

	/** Store connected gamepad and start listening for button presses. */
	private gamepadConnected(event: GamepadEvent) {
		const { gamepad } = event

		console.info(
			'Gamepad connected at index %d: %s. %d buttons, %d axes. Are you ready to rock?',
			gamepad.index,
			gamepad.id,
			gamepad.buttons.length,
			gamepad.axes.length
		)

		this.gamepads[gamepad.index] = true
		this.readGamepadValues()
	}

	/** Delete the disconnected gamepad from state. */
	private gamepadDisconnected(event: GamepadEvent) {
		const { gamepad } = event

		console.info(
			'Gamepad disconnected from index %d: %s',
			gamepad.index,
			gamepad.id
		)
		delete this.gamepads[gamepad.index]
	}

	/** Respond to gamepad button presses by checking the queue against the required pattern. */
	private buttonPressed(id: number): void {
		this.checkTime()
		this.entries.push(id)
		this.lastEntryTime = this.now

		if (this.currentCode === this.pattern) {
			this.loadConfetti()
		}
	}

	/** Reads pressed button values from the connected gamepad. */
	private readGamepadValues(): void {
		// Traverse the list of gamepads reading the ones connected to this browser
		this.gamepadIndexes.forEach((item, index) => {
			if (!item || !this.connectedGamepads || !this.connectedGamepads[index])
				return

			const { buttons } = this.connectedGamepads[index] as Gamepad

			buttons.forEach((button, index) => {
				if (button.pressed) {
					// If the button is pressed && its previous state was not pressed, mark it as pressed and call the handler
					if (!this.buttonState[index]) {
						this.buttonState[index] = true
						this.buttonPressed(index)
					}
				} else {
					delete this.buttonState[index]
				}
			})
		})

		// Continue to call itself while there are gamepads connected
		if (this.gamepadIndexes.length > 0) {
			window.requestAnimationFrame(this.readGamepadValues)
		}
	}

	/** Import the confetti and prepare it to fire. */
	private loadConfetti(): void {
		import(config.packages.confetti).then((module) => {
			const { default: confetti } = module
			const duration: number = this.duration * 1000
			const animationEnd: number = this.now + duration

			this.timer = window.setInterval(
				() => this.fireConfetti(confetti, duration, animationEnd),
				250
			)
		})
	}

	/** Fire confetti onto the screen. You win! */
	public fireConfetti(module: any, duration: number, end: number) {
		const timeLeft: number = end - this.now

		if (timeLeft <= 0) {
			clearInterval(this.timer)
		}

		const particleCount: number = 50 * (timeLeft / duration)

		const randomInRange = (min: number, max: number): number =>
			Math.random() * (max - min) + min
		const yCoordinate = (): number => Math.random() - 0.2

		const firstVariation: ConfettiOptions = {
			particleCount,
			origin: {
				x: randomInRange(0.1, 0.3),
				y: yCoordinate(),
			},
		}

		const secondVariation: ConfettiOptions = {
			particleCount,
			origin: {
				x: randomInRange(0.7, 0.9),
				y: yCoordinate(),
			},
		}

		module(Object.assign({}, this.confettiOptions, firstVariation))
		module(Object.assign({}, this.confettiOptions, secondVariation))

		this.destroy()
	}

	/** Every key event will check the time and the queue. */
	init(keyEvent: KeyboardEvent) {
		this.checkTime()
		this.checkCode(keyEvent)
	}

	/** Add the appropriate event listeners. */
	listen(this: CheatCode) {
		switch (this.eventType) {
			case Events.Gamepad:
				window.addEventListener(GAMEPADCONNECTED, this.gamepadConnected)
				window.addEventListener(GAMEPADDISCONNECTED, this.gamepadDisconnected)
				break
			case Events.Keyboard:
			default:
				document.addEventListener(KEYDOWN, this.init)
				break
		}
	}

	/** Clean up. */
	private destroy() {
		switch (this.eventType) {
			case Events.Gamepad:
				window.removeEventListener(GAMEPADCONNECTED, this.gamepadConnected)
				break
			case Events.Keyboard:
			default:
				document.removeEventListener(KEYDOWN, this.init)
				break
		}
	}
}
