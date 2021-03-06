import Component from "@ember/component"
import { get } from "@ember/object"
import { scheduleOnce } from "@ember/runloop"

import layout from "../templates/components/ember-inline-editor"

const isInputField = el => {
  const { tagName } = el

  if (!tagName) {
    return false
  }

  return ["input", "textarea", "select"].includes(tagName.toLowerCase())
}

export default Component.extend({
  layout,
  classNameBindings: ["isVisible:is-visible:is-hidden"],

  textFields: ["search", "url", "text", "phone", "email", "number"],
  textAreaFields: ["textarea"],

  didReceiveAttrs() {
    scheduleOnce("afterRender", this.focusOnInput.bind(this))
  },

  focusOnInput() {
    const children = this.element.childNodes

    children.forEach(child => {
      if (isInputField(child)) child.focus()
    })
  },

  keyUp(ev) {
    const field = get(this, "field")
    const textAreaFields = get(this, "textAreaFields")

    const { keyCode } = ev

    const isEnter = keyCode === 13
    const isEsc = keyCode === 27

    if (isEnter && !textAreaFields.includes(field)) {
      this.sendAction("on-save")
    } else if (isEsc) {
      this.sendAction("on-cancel")
    }
  }
})
