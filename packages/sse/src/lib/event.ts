export class SseEvent {
  #event: string
  #data: string[]
  #id: string | null

  constructor(event: string = 'message') {
    this.#event = event
    this.#data = []
    this.#id = null
  }

  data(line: string): SseEvent {
    for (let part of line.split('\n')) {
      this.#data.push(part)
    }
    return this
  }

  id(id: string): SseEvent {
    this.#id = id
    return this
  }

  *build() {
    if (this.#id !== null) {
      yield `id: ${this.#id}`
    }

    if (this.#event !== 'message') {
      yield `event: ${this.#event}`
    }

    for (let line of this.#data) {
      yield `data: ${line}`
    }
  }
}
