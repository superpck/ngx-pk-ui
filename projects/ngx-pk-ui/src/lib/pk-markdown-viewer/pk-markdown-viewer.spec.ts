import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { PkMarkdownViewer } from './pk-markdown-viewer';
import { parseMarkdown } from './pk-markdown-parser';

// ── Parser unit tests ──────────────────────────────────────────────────────────
describe('parseMarkdown', () => {
  it('renders h1', () => {
    expect(parseMarkdown('# Hello')).toContain('<h1');
    expect(parseMarkdown('# Hello')).toContain('Hello');
  });

  it('renders h2', () => {
    expect(parseMarkdown('## World')).toContain('<h2');
  });

  it('renders bold', () => {
    expect(parseMarkdown('**bold**')).toContain('<strong>bold</strong>');
  });

  it('renders italic', () => {
    expect(parseMarkdown('*italic*')).toContain('<em>italic</em>');
  });

  it('renders strikethrough', () => {
    expect(parseMarkdown('~~del~~')).toContain('<del>del</del>');
  });

  it('renders inline code', () => {
    expect(parseMarkdown('`code`')).toContain('<code>code</code>');
  });

  it('renders fenced code block', () => {
    const md = '```ts\nconst x = 1;\n```';
    const html = parseMarkdown(md);
    expect(html).toContain('<pre>');
    expect(html).toContain('<code');
    expect(html).toContain('const x = 1;');
  });

  it('escapes HTML in code blocks', () => {
    const md = '```\n<script>alert(1)</script>\n```';
    const html = parseMarkdown(md);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('renders unordered list', () => {
    const md = '- item1\n- item2';
    const html = parseMarkdown(md);
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>item1</li>');
    expect(html).toContain('<li>item2</li>');
  });

  it('renders ordered list', () => {
    const md = '1. first\n2. second';
    const html = parseMarkdown(md);
    expect(html).toContain('<ol>');
    expect(html).toContain('<li>first</li>');
  });

  it('renders blockquote', () => {
    expect(parseMarkdown('> quote')).toContain('<blockquote>');
  });

  it('renders horizontal rule', () => {
    expect(parseMarkdown('---')).toContain('<hr>');
    expect(parseMarkdown('***')).toContain('<hr>');
    expect(parseMarkdown('___')).toContain('<hr>');
  });

  it('renders link', () => {
    const html = parseMarkdown('[Angular](https://angular.dev)');
    expect(html).toContain('<a href="https://angular.dev"');
    expect(html).toContain('Angular');
  });

  it('renders image', () => {
    const html = parseMarkdown('![logo](logo.png)');
    expect(html).toContain('<img');
    expect(html).toContain('src="logo.png"');
  });

  it('renders table', () => {
    const md = '| A | B |\n|---|---|\n| 1 | 2 |';
    const html = parseMarkdown(md);
    expect(html).toContain('<table>');
    expect(html).toContain('<th');
    expect(html).toContain('<td');
  });
});

// ── Component tests ────────────────────────────────────────────────────────────
@Component({
  imports: [PkMarkdownViewer],
  template: `<pk-markdown-viewer [content]="md" />`,
})
class TestHost {
  md = '# Hello\n\nWorld';
}

describe('PkMarkdownViewer', () => {
  let fixture: ComponentFixture<TestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
  });

  it('renders the component', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('pk-markdown-viewer')).toBeTruthy();
  });

  it('renders markdown content', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Hello');
    expect(el.querySelector('p')?.textContent).toContain('World');
  });

  it('shows the toolbar by default', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.pk-md__toolbar')).toBeTruthy();
  });
});
