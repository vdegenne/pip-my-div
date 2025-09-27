import {html, LitElement} from 'lit'
import {customElement, query} from 'lit/decorators.js'
import './pip-element.js'
import {type PipElement} from './pip-element.js'

@customElement('test-shell')
class TestShell extends LitElement {
	@query('pip-element') pipElement!: PipElement
	render() {
		return html`
			<div>
				<pip-element>
					<div style="background:red">
						<div>hello</div>
						<div>world</div>
					</div>
				</pip-element>
			</div>
			<button @click=${this.#pipMe}>pip me</button>
		`
	}

	#pipMe = () => {
		this.pipElement.pip()
	}
}

const shell = new TestShell()
document.body.appendChild(shell)
