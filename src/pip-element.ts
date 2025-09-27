import {css, html, LitElement} from 'lit'
import {customElement} from 'lit/decorators.js'

declare global {
	interface HTMLElementTagNameMap {
		'pip-element': LitElement
	}
}

@customElement('pip-element')
export class PipElement extends LitElement {
	static styles = css`
		:host {
			display: block;
		}
	`
	// protected createRenderRoot() {
	// 	return this
	// }
	//
	render() {
		return html`<slot></slot>`
	}
	async pip() {
		const slot = this.shadowRoot!.querySelector('slot')
		const children = slot!.assignedElements({flatten: true})
		console.log(children)
		// if (this.children.length === 0 || this.children.length > 1) {
		// 	throw new Error('content of <pip-element> needs to have only 1 element')
		// }
		// console.log(this.childNodes)

		const pipWindow = await window.documentPictureInPicture.requestWindow()
		const container = document.createElement('div')
		// const firstChild = this.children[0] as HTMLElement
		children.forEach((child) => pipWindow.document.body.append(child))
		pipWindow.addEventListener('pagehide', () => {
			children.forEach((child) => this.append(child))
		})
	}
}
