import {
  Cpu 
} from './index';
import {
  consoleLog 
} from '../helpers/index';


// Set flag bit on on register F. For instance set zero flag to zero -> (7, 0)
function setFlagBit(flagBit: u8, flagValue: u8): u8 {

  let bitwiseOperand: u8 = 0x01 << flagBit;
  if(flagValue > 0) {
    Cpu.registerF = Cpu.registerF | bitwiseOperand;
  } else {
    // XOR out the two ones
    bitwiseOperand = 0xFF ^ bitwiseOperand;
    Cpu.registerF = Cpu.registerF & bitwiseOperand;
  }

  return Cpu.registerF;
}

// Overload the set flag bit for ease of use
export function setZeroFlag(value: u8): void {
  setFlagBit(7, value);
}

export function setSubtractFlag(value: u8): void {
  setFlagBit(6, value)
}

export function setHalfCarryFlag(value: u8): void {
  setFlagBit(5, value);
}

export function setCarryFlag(value: u8): void {
  setFlagBit(4, value)
}

// Getters for flags
export function getZeroFlag(): u8 {
  return (Cpu.registerF >> 7) & 0x01;
}

export function getSubtractFlag(): u8 {
  return (Cpu.registerF >> 6) & 0x01;
}

export function getHalfCarryFlag(): u8 {
  return (Cpu.registerF >> 5) & 0x01;
}

export function getCarryFlag(): u8 {
  return (Cpu.registerF >> 4) & 0x01;
}

// Must be run before the register actually performs the add
// amountToAdd i16, since max number can be an u8
export function checkAndSetEightBitHalfCarryFlag(value: u8, amountToAdd: i16): void {
  if(amountToAdd >= 0) {
    // https://robdor.com/2016/08/10/gameboy-emulator-half-carry-flag/
    let result: u8 = (((<u8>value & 0x0F) + (<u8>amountToAdd & 0x0F)) & 0x10)
    if(result !== 0x00) {
      setHalfCarryFlag(1);
    } else {
      setHalfCarryFlag(0);
    }
  } else {
    // From: https://github.com/djhworld/gomeboycolor/blob/master/src/cpu/cpu.go
    // CTRL+F "subBytes(a, b byte)"
    if(<u8>(abs(amountToAdd) & 0x0F) > (value & 0x0F)) {
      setHalfCarryFlag(1);
    } else {
      setHalfCarryFlag(0);
    }
  }
}

export function checkAndSetEightBitCarryFlag(value: u8, amountToAdd: i16): void {
  if (amountToAdd >= 0) {
    let result: u8 = value + <u8>amountToAdd;
    if (value > result) {
      setCarryFlag(1);
    } else {
      setCarryFlag(0);
    }
  } else {
    if(abs(amountToAdd) > value) {
      setCarryFlag(1);
    } else {
      setCarryFlag(0);
    }
  }
}

// Function to handle 16 bit addition overflow, and set the carry flags accordingly
// i32 on valueTwo to support passing signed immedaite values
export function checkAndSetSixteenBitFlagsAddOverflow(valueOne: u16, valueTwo: i32, useStackPointerBits: boolean): void {
  // need to differentiate between HL and SP
  // HL carries are at 11 and 15, SP carries are at 3 and 7 :p
  if(useStackPointerBits) {
    // Logic from : https://github.com/nakardo/node-gameboy/blob/master/lib/cpu/opcodes.js
    // CTRL+F add_sp_n
    // using the stack pointer bits means we can safely assume the value is signed
    let signedValueOne: i32 = <i32>valueOne;
    let result: i32 = signedValueOne + <i32>valueTwo;

    let flagXor: i32 = signedValueOne ^ valueTwo ^ result;

    if((flagXor & 0x10) !== 0) {
      setHalfCarryFlag(1);
    } else {
      setHalfCarryFlag(0);
    }

    if((flagXor & 0x100) !== 0) {
      setCarryFlag(1);
    } else {
      setCarryFlag(0);
    }
  } else {
    // Logic from: https://github.com/djhworld/gomeboycolor/blob/master/src/cpu/cpu.go
    // CTRL+F addWords
    // Value two is not signed
    let result: u16 = valueOne + <u16>valueTwo;

    // Check the carry flag by allowing the overflow
    if(result < valueOne) {
      setCarryFlag(1);
    } else {
      setCarryFlag(0);
    }

    // To check for half carry flag (bit 15), by XOR'ing valyes, and and'ing the bit in question
    if ( ((valueOne ^ <u16>valueTwo ^ <u16>result) & 0x1000) !== 0x00 ) {
      setHalfCarryFlag(1);
    } else {
      setHalfCarryFlag(0);
    }
  }
}
