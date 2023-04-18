// #ifdef H5
export default {
  name: 'Keypress',
  props: {
    disable: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    const keyNames = {
      esc: ['Esc', 'Escape'],
      tab: 'Tab',
      enter: 'Enter',
      space: [' ', 'Spacebar'],
      up: ['Up', 'ArrowUp'],
      left: ['Left', 'ArrowLeft'],
      right: ['Right', 'ArrowRight'],
      down: ['Down', 'ArrowDown'],
      delete: ['Backspace', 'Delete', 'Del']
    }
    const listener = ($event) => {
      if (this.disable) {
        return
      }
      const keyName = Object.keys(keyNames).find(key => {
        const keyName = $event.key
        const value = keyNames[key]
        return value === keyName || (Array.isArray(value) && value.includes(keyName))
      })
      if (keyName) {
        // 
        setTimeout(() => {
          this.$emit(keyName, {})
        }, 0)
      }
    }
    document.addEventListener('keyup', listener)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('keyup', listener)
    })
  },
	render: () => {}
}
// #endif
