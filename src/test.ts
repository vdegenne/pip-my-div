import {html, LitElement} from 'lit'
import {customElement, query} from 'lit/decorators.js'
import './pip-element.js'
import {type PipElement} from './pip-element.js'

@customElement('test-shell')
class TestShell extends LitElement {
	@query('pip-element') pipElement!: PipElement

	render() {
		return html`
			<pip-element
				style="background-color:red;width:400px;height:400px;display:flex;align-items:center;justify-content:center;flex-direction:column;font-size:4rem"
			>
				<div>hello</div>
				<div>world</div>
			</pip-element>
			<button @click=${this.#pipMe}>pip me</button>
		`
	}

	#pipMe = () => {
		this.pipElement.pip()
	}
}

const shell = new TestShell()
document.body.appendChild(shell)
