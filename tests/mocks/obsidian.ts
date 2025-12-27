/**
 * Obsidian API 모킹
 * 테스트에서 사용하는 Obsidian 모듈의 모의 구현
 */

import { vi } from 'vitest';

// ItemView 모의 클래스
export class ItemView {
	app: App;
	leaf: WorkspaceLeaf;
	containerEl: HTMLElement;

	constructor(leaf: WorkspaceLeaf) {
		this.leaf = leaf;
		this.app = leaf.app;
		this.containerEl = document.createElement('div');
	}

	getViewType(): string {
		return '';
	}

	getDisplayText(): string {
		return '';
	}

	async onOpen(): Promise<void> {
		// Override in subclass
	}

	async onClose(): Promise<void> {
		// Override in subclass
	}
}

// Plugin 모의 클래스
export class Plugin {
	app: App;
	manifest: PluginManifest;

	constructor(app: App, manifest: PluginManifest) {
		this.app = app;
		this.manifest = manifest;
	}

	async loadData(): Promise<unknown> {
		return {};
	}

	async saveData(data: unknown): Promise<void> {
		// Mock implementation
	}

	registerView(type: string, viewCreator: (leaf: WorkspaceLeaf) => ItemView): void {
		// Mock implementation
	}

	addSettingTab(settingTab: PluginSettingTab): void {
		// Mock implementation
	}

	addCommand(command: Command): void {
		// Mock implementation
	}

	addRibbonIcon(icon: string, title: string, callback: () => void): HTMLElement {
		return document.createElement('div');
	}
}

// PluginSettingTab 모의 클래스
export class PluginSettingTab {
	app: App;
	plugin: Plugin;
	containerEl: HTMLElement;

	constructor(app: App, plugin: Plugin) {
		this.app = app;
		this.plugin = plugin;
		this.containerEl = document.createElement('div');
	}

	display(): void {
		// Override in subclass
	}

	hide(): void {
		// Override in subclass
	}
}

// Setting 모의 클래스
export class Setting {
	settingEl: HTMLElement;
	infoEl: HTMLElement;
	nameEl: HTMLElement;
	descEl: HTMLElement;
	controlEl: HTMLElement;

	constructor(containerEl: HTMLElement) {
		this.settingEl = containerEl.createDiv();
		this.infoEl = this.settingEl.createDiv();
		this.nameEl = this.infoEl.createDiv();
		this.descEl = this.infoEl.createDiv();
		this.controlEl = this.settingEl.createDiv();
	}

	setName(name: string): this {
		this.nameEl.textContent = name;
		return this;
	}

	setDesc(desc: string): this {
		this.descEl.textContent = desc;
		return this;
	}

	addText(cb: (text: TextComponent) => unknown): this {
		const text = new TextComponent(this.controlEl);
		cb(text);
		return this;
	}

	addDropdown(cb: (dropdown: DropdownComponent) => unknown): this {
		const dropdown = new DropdownComponent(this.controlEl);
		cb(dropdown);
		return this;
	}

	addToggle(cb: (toggle: ToggleComponent) => unknown): this {
		const toggle = new ToggleComponent(this.controlEl);
		cb(toggle);
		return this;
	}

	addButton(cb: (button: ButtonComponent) => unknown): this {
		const button = new ButtonComponent(this.controlEl);
		cb(button);
		return this;
	}

	addTextArea(cb: (textArea: TextAreaComponent) => unknown): this {
		const textArea = new TextAreaComponent(this.controlEl);
		cb(textArea);
		return this;
	}
}

// 컴포넌트 모의 클래스들
export class TextComponent {
	inputEl: HTMLInputElement;

	constructor(containerEl: HTMLElement) {
		this.inputEl = containerEl.createEl('input', { type: 'text' });
	}

	setValue(value: string): this {
		this.inputEl.value = value;
		return this;
	}

	setPlaceholder(placeholder: string): this {
		this.inputEl.placeholder = placeholder;
		return this;
	}

	onChange(cb: (value: string) => unknown): this {
		this.inputEl.addEventListener('input', () => cb(this.inputEl.value));
		return this;
	}
}

export class TextAreaComponent {
	inputEl: HTMLTextAreaElement;

	constructor(containerEl: HTMLElement) {
		this.inputEl = containerEl.createEl('textarea');
	}

	setValue(value: string): this {
		this.inputEl.value = value;
		return this;
	}

	setPlaceholder(placeholder: string): this {
		this.inputEl.placeholder = placeholder;
		return this;
	}

	onChange(cb: (value: string) => unknown): this {
		this.inputEl.addEventListener('input', () => cb(this.inputEl.value));
		return this;
	}
}

export class DropdownComponent {
	selectEl: HTMLSelectElement;

	constructor(containerEl: HTMLElement) {
		this.selectEl = containerEl.createEl('select');
	}

	addOption(value: string, display: string): this {
		const option = this.selectEl.createEl('option');
		option.value = value;
		option.textContent = display;
		return this;
	}

	setValue(value: string): this {
		this.selectEl.value = value;
		return this;
	}

	onChange(cb: (value: string) => unknown): this {
		this.selectEl.addEventListener('change', () => cb(this.selectEl.value));
		return this;
	}
}

export class ToggleComponent {
	toggleEl: HTMLInputElement;

	constructor(containerEl: HTMLElement) {
		this.toggleEl = containerEl.createEl('input', { type: 'checkbox' });
	}

	setValue(value: boolean): this {
		this.toggleEl.checked = value;
		return this;
	}

	onChange(cb: (value: boolean) => unknown): this {
		this.toggleEl.addEventListener('change', () => cb(this.toggleEl.checked));
		return this;
	}
}

export class ButtonComponent {
	buttonEl: HTMLButtonElement;

	constructor(containerEl: HTMLElement) {
		this.buttonEl = containerEl.createEl('button');
	}

	setButtonText(text: string): this {
		this.buttonEl.textContent = text;
		return this;
	}

	setCta(): this {
		this.buttonEl.classList.add('mod-cta');
		return this;
	}

	onClick(cb: () => unknown): this {
		this.buttonEl.addEventListener('click', cb);
		return this;
	}
}

// Notice 모의 클래스
export class Notice {
	message: string;
	duration: number;

	constructor(message: string, duration?: number) {
		this.message = message;
		this.duration = duration ?? 5000;
	}

	hide(): void {
		// Mock implementation
	}
}

// MarkdownView 모의 클래스
export class MarkdownView extends ItemView {
	editor: Editor;
	file: TFile | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
		this.editor = createMockEditor();
	}

	getViewType(): string {
		return 'markdown';
	}
}

// TFile 모의 클래스
export class TFile {
	path: string;
	name: string;
	basename: string;
	extension: string;
	vault: Vault;
	parent: TFolder | null = null;

	constructor(path: string) {
		this.path = path;
		const parts = path.split('/');
		this.name = parts[parts.length - 1];
		const nameParts = this.name.split('.');
		this.extension = nameParts.length > 1 ? nameParts.pop()! : '';
		this.basename = nameParts.join('.');
		this.vault = createMockVault();
	}
}

// TFolder 모의 클래스
export class TFolder {
	path: string;
	name: string;
	parent: TFolder | null = null;
	children: (TFile | TFolder)[] = [];

	constructor(path: string) {
		this.path = path;
		const parts = path.split('/');
		this.name = parts[parts.length - 1];
	}
}

// App 인터페이스 모의
export interface App {
	vault: Vault;
	workspace: Workspace;
	plugins: {
		enabledPlugins: Set<string>;
		plugins: Record<string, Plugin>;
		enablePlugin(id: string): Promise<void>;
		disablePlugin(id: string): Promise<void>;
	};
}

// Vault 인터페이스 모의
export interface Vault {
	getRoot(): TFolder;
	getAbstractFileByPath(path: string): TFile | TFolder | null;
	read(file: TFile): Promise<string>;
	modify(file: TFile, data: string): Promise<void>;
	create(path: string, data: string): Promise<TFile>;
	delete(file: TFile): Promise<void>;
	adapter: {
		basePath: string;
	};
}

// Workspace 인터페이스 모의
export interface Workspace {
	activeLeaf: WorkspaceLeaf | null;
	getActiveViewOfType<T extends ItemView>(type: new (...args: unknown[]) => T): T | null;
	getLeavesOfType(type: string): WorkspaceLeaf[];
	getRightLeaf(shouldCreate: boolean): WorkspaceLeaf | null;
	revealLeaf(leaf: WorkspaceLeaf): void;
	on(name: string, callback: (...args: unknown[]) => unknown): EventRef;
	off(name: string, callback: (...args: unknown[]) => unknown): void;
	offref(ref: EventRef): void;
}

// WorkspaceLeaf 인터페이스 모의
export interface WorkspaceLeaf {
	app: App;
	view: ItemView;
	setViewState(viewState: { type: string; active?: boolean }): Promise<void>;
}

// Editor 인터페이스 모의
export interface Editor {
	getSelection(): string;
	getValue(): string;
	setValue(value: string): void;
	replaceSelection(text: string): void;
}

// EventRef 인터페이스
export interface EventRef {
	// Marker type for event references
}

// PluginManifest 인터페이스
export interface PluginManifest {
	id: string;
	name: string;
	version: string;
	author: string;
	description: string;
}

// Command 인터페이스
export interface Command {
	id: string;
	name: string;
	callback?: () => void;
	checkCallback?: (checking: boolean) => boolean | void;
}

// setIcon 유틸리티 함수 모의
export function setIcon(parent: HTMLElement, iconId: string): void {
	parent.dataset.icon = iconId;
	parent.classList.add('svg-icon');
}

// 모의 객체 생성 헬퍼 함수들
export function createMockApp(): App {
	const vault = createMockVault();
	const workspace = createMockWorkspace();

	return {
		vault,
		workspace,
		plugins: {
			enabledPlugins: new Set(),
			plugins: {},
			enablePlugin: vi.fn(),
			disablePlugin: vi.fn(),
		},
	};
}

export function createMockVault(): Vault {
	return {
		getRoot: () => new TFolder('/'),
		getAbstractFileByPath: vi.fn(() => null),
		read: vi.fn(async () => ''),
		modify: vi.fn(async () => {}),
		create: vi.fn(async (path) => new TFile(path)),
		delete: vi.fn(async () => {}),
		adapter: {
			basePath: '/mock/vault',
		},
	};
}

export function createMockWorkspace(): Workspace {
	return {
		activeLeaf: null,
		getActiveViewOfType: vi.fn(() => null),
		getLeavesOfType: vi.fn(() => []),
		getRightLeaf: vi.fn(() => null),
		revealLeaf: vi.fn(),
		on: vi.fn(() => ({})),
		off: vi.fn(),
		offref: vi.fn(),
	};
}

export function createMockLeaf(app?: App): WorkspaceLeaf {
	const mockApp = app ?? createMockApp();
	return {
		app: mockApp,
		view: null as unknown as ItemView,
		setViewState: vi.fn(async () => {}),
	};
}

export function createMockEditor(): Editor {
	return {
		getSelection: vi.fn(() => ''),
		getValue: vi.fn(() => ''),
		setValue: vi.fn(),
		replaceSelection: vi.fn(),
	};
}

// HTMLElement에 createEl과 createDiv 확장
declare global {
	interface HTMLElement {
		createEl<K extends keyof HTMLElementTagNameMap>(
			tag: K,
			options?: { cls?: string; text?: string; type?: string; attr?: Record<string, string> }
		): HTMLElementTagNameMap[K];
		createDiv(options?: { cls?: string; text?: string; attr?: Record<string, string> }): HTMLDivElement;
		createSpan(options?: { cls?: string; text?: string; attr?: Record<string, string> }): HTMLSpanElement;
		empty(): void;
	}
}

// HTMLElement 확장 구현
HTMLElement.prototype.createEl = function <K extends keyof HTMLElementTagNameMap>(
	tag: K,
	options?: { cls?: string; text?: string; type?: string; attr?: Record<string, string> }
): HTMLElementTagNameMap[K] {
	const el = document.createElement(tag);
	if (options?.cls) {
		el.className = options.cls;
	}
	if (options?.text) {
		el.textContent = options.text;
	}
	if (options?.type && 'type' in el) {
		(el as HTMLInputElement).type = options.type;
	}
	if (options?.attr) {
		for (const [key, value] of Object.entries(options.attr)) {
			el.setAttribute(key, value);
		}
	}
	this.appendChild(el);
	return el;
};

HTMLElement.prototype.createDiv = function (options?: { cls?: string; text?: string; attr?: Record<string, string> }): HTMLDivElement {
	return this.createEl('div', options);
};

HTMLElement.prototype.createSpan = function (options?: { cls?: string; text?: string; attr?: Record<string, string> }): HTMLSpanElement {
	return this.createEl('span', options);
};

HTMLElement.prototype.empty = function (): void {
	this.innerHTML = '';
};
