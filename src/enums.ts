/**
 * Guitar Hero guitar controller key mappings.
 *
 * - Buttons numbered 4 and 5 do not register.
 * - The strum and whammy bars don't produce a button, so they are probably supposed to be buttons 4 and 5.
 *
 * The combo to trigger starpower: 7, 1, 7, 0, 7, 2, 7, 3, 6
 * Starpower in colors: Green, Red, Green, Yellow, Green, Blue, Green, Orange, Tilt
 */
export enum GuitarHeroKeymap {
	Yellow = 0,
	Red = 1,
	Blue = 2,
	Orange = 3,
	Tilt = 6,
	Green = 7,
	Select = 8,
	Start = 9,
}

/** PS2 controller key mappings. */
export enum PlaystationTwoKeyMap {
	Triangle = 0,
	Circle = 1,
	X = 2,
	Square = 3,
	L1 = 4,
	R1 = 5,
	L2 = 6,
	R2 = 7,
	Select = 8,
	Start = 9,
	LeftStick = 10,
	RightStick = 11,
}

/** Possible event types for listening to cheat codes. */
export enum Events {
	Keyboard = "keyboard",
	Gamepad = "gamepad",
}
