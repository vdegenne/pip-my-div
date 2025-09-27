import html2canvas from 'html2canvas'
import {LitElement, css, html} from 'lit'
import {customElement} from 'lit/decorators.js'

declare global {
	interface HTMLElementTagNameMap {
		'pip-element': PipElement
	}
}

@customElement('pip-element')
export class PipElement extends LitElement {
	#canvas = document.createElement('canvas')
	#video?: HTMLVideoElement
	#pipStream?: MediaStream
	#loopInterval?: number
	#lastSnapshot = ''

	static styles = css`
		:host {
			display: block;
		}
	`

	get target() {
		return this
	}

	// -------------------
	// 1. Convert content to canvas
	// -------------------
	async contentToCanvas(target: HTMLElement): Promise<HTMLCanvasElement> {
		try {
			if (
				this.#canvas.width !== target.offsetWidth ||
				this.#canvas.height !== target.offsetHeight
			) {
				this.#canvas.width = target.offsetWidth
				this.#canvas.height = target.offsetHeight
			}
			const offscreen = document.createElement('canvas')
			offscreen.width = target.offsetWidth
			offscreen.height = target.offsetHeight
			await html2canvas(target, {canvas: offscreen, allowTaint: true, scale: 1})

			// Copy to main canvas in one sync operation
			const ctx = this.#canvas.getContext('2d')!
			ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)
			ctx.drawImage(offscreen, 0, 0)
			return this.#canvas
		} catch (err) {
			console.error('Failed to render content to canvas:', err)
			return this.#canvas // return current canvas anyway
		}
	}

	// -------------------
	// 2. Initiate PiP
	// -------------------

	async pip() {
		const target = this.target
		if (!target) return

		if (!this.#video) {
			this.#video = document.createElement('video')
			this.#video.autoplay = true
			this.#video.muted = true
			this.#video.playsInline = true
			this.#video.style.display = 'none'
			document.body.appendChild(this.#video)

			// Listen for PiP close
			this.#video.addEventListener('leavepictureinpicture', () => {
				if (this.#loopInterval) {
					clearInterval(this.#loopInterval)
					this.#loopInterval = undefined
				}
			})
		}

		await this.contentToCanvas(target)

		if (!this.#pipStream) {
			this.#pipStream = this.#canvas.captureStream(5)
			this.#video.srcObject = this.#pipStream
			await this.#video.play()
			await this.#video.requestPictureInPicture()
		}

		this.loop()
	}

	// -------------------
	// 3. Loop to update PiP
	// -------------------
	loop() {
		// Clear previous interval if any
		if (this.#loopInterval) clearInterval(this.#loopInterval)

		// Also poll every 2s in case dynamic changes inside the element
		this.#loopInterval = window.setInterval(async () => {
			await this.updateCanvasIfChanged()
		}, 2000)
	}

	// Helper to detect content changes and update canvas
	private updateCanvasIfChanged = async () => {
		if (!this.#loopInterval) return // stop if PiP loop isn't running

		const target = this.target
		const current = target.innerHTML
		if (current === this.#lastSnapshot) return
		this.#lastSnapshot = current

		await this.contentToCanvas(target)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		if (this.#loopInterval) clearInterval(this.#loopInterval)
	}

	render() {
		return html`<slot @slotchange=${this.updateCanvasIfChanged}></slot>`
	}
}
