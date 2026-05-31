import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pk-float-btn',
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">pk-float-btn</h1>
      <p class="page-subtitle">Floating action button — pure CSS utility class</p>

      <!-- ── Overview ──────────────────────────────────────── -->
      <section class="section">
        <h2>Overview</h2>
        <p>
          Floating buttons are fixed-position buttons that stay visible while scrolling.
          Use for primary actions like "Back to top", navigation, or quick actions.
        </p>
      </section>

      <!-- ── Installation ──────────────────────────────────── -->
      <section class="section">
        <h2>Installation</h2>
        <p>Already included in <code>pk-ui.css</code> — no separate import needed.</p>
        <pre><code>{{ installCode }}</code></pre>
      </section>

      <!-- ── Basic Usage ───────────────────────────────────── -->
      <section class="section">
        <h2>Basic Usage</h2>
        <div class="demo-box" style="position: relative; height: 300px; overflow: hidden; background: linear-gradient(to bottom, #f0f9ff, #e0f2fe);">
          <a class="pk-float-btn pk-float-btn--top-center" style="position: absolute;">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </a>
          <p style="text-align: center; padding-top: 80px; color: #64748b;">
            Floating button at top-center
          </p>
        </div>
        <pre><code>{{ basicCode }}</code></pre>
      </section>

      <!-- ── Positions ─────────────────────────────────────── -->
      <section class="section">
        <h2>Positions</h2>
        <p>6 position variants: top/bottom × left/center/right</p>
        <div class="demo-box" style="position: relative; height: 400px; background: linear-gradient(to bottom, #fef3c7, #fde68a); overflow: hidden;">
          <a class="pk-float-btn pk-float-btn--top-left" style="position: absolute;">Top Left</a>
          <a class="pk-float-btn pk-float-btn--top-center" style="position: absolute;">Top Center</a>
          <a class="pk-float-btn pk-float-btn--top-right" style="position: absolute;">Top Right</a>
          <a class="pk-float-btn pk-float-btn--bottom-left" style="position: absolute;">Bottom Left</a>
          <a class="pk-float-btn pk-float-btn--bottom-center" style="position: absolute;">Bottom Center</a>
          <a class="pk-float-btn pk-float-btn--bottom-right" style="position: absolute;">Bottom Right</a>
        </div>
        <pre><code>{{ positionsCode }}</code></pre>
      </section>

      <!-- ── Color Variants ────────────────────────────────── -->
      <section class="section">
        <h2>Color Variants</h2>
        <div class="demo-box" style="position: relative; height: 500px; background: #f8fafc; overflow-y: auto; padding: 20px;">
          <div style="display: flex; flex-direction: column; gap: 16px; max-width: 600px; margin: 0 auto;">
            <a class="pk-float-btn" style="position: relative; top: 0; left: 0;">
              Primary (default)
            </a>
            <a class="pk-float-btn pk-float-btn--secondary" style="position: relative; top: 0; left: 0;">
              Secondary
            </a>
            <a class="pk-float-btn pk-float-btn--success" style="position: relative; top: 0; left: 0;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Success
            </a>
            <a class="pk-float-btn pk-float-btn--error" style="position: relative; top: 0; left: 0;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Error
            </a>
            <a class="pk-float-btn pk-float-btn--warning" style="position: relative; top: 0; left: 0;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Warning
            </a>
            <a class="pk-float-btn pk-float-btn--info" style="position: relative; top: 0; left: 0;">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Info
            </a>
            <a class="pk-float-btn pk-float-btn--dark" style="position: relative; top: 0; left: 0;">
              Dark
            </a>
          </div>
        </div>
        <pre><code>{{ colorsCode }}</code></pre>
      </section>

      <!-- ── Sizes ─────────────────────────────────────────── -->
      <section class="section">
        <h2>Sizes</h2>
        <div class="demo-box" style="position: relative; height: 300px; background: #fef3c7; overflow: hidden;">
          <a class="pk-float-btn pk-float-btn--sm" style="position: absolute; top: 50%; left: 20%; transform: translateY(-50%);">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            Small
          </a>
          <a class="pk-float-btn" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            Medium (default)
          </a>
          <a class="pk-float-btn pk-float-btn--lg" style="position: absolute; top: 50%; right: 20%; transform: translateY(-50%);">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            Large
          </a>
        </div>
        <pre><code>{{ sizesCode }}</code></pre>
      </section>

      <!-- ── Icon Only ─────────────────────────────────────── -->
      <section class="section">
        <h2>Icon Only</h2>
        <p>Circular floating buttons with no text — combine with <code>--icon</code> modifier.</p>
        <div class="demo-box" style="position: relative; height: 280px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); overflow: hidden;">
          <a class="pk-float-btn pk-float-btn--icon pk-float-btn--sm pk-float-btn--dark" style="position: absolute; top: 50%; left: 20%; transform: translateY(-50%);">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
          </a>
          <a class="pk-float-btn pk-float-btn--icon pk-float-btn--dark" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
          </a>
          <a class="pk-float-btn pk-float-btn--icon pk-float-btn--lg pk-float-btn--dark" style="position: absolute; top: 50%; right: 20%; transform: translateY(-50%);">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
          </a>
        </div>
        <pre><code>{{ iconOnlyCode }}</code></pre>
      </section>

      <!-- ── Disabled State ────────────────────────────────── -->
      <section class="section">
        <h2>Disabled State</h2>
        <div class="demo-box">
          <a class="pk-float-btn pk-float-btn--disabled" style="position: relative; top: 0; left: 0; margin: 16px;">
            Disabled
          </a>
          <button class="pk-float-btn" disabled style="position: relative; top: 0; left: 0; margin: 16px;">
            Button Disabled
          </button>
        </div>
        <pre><code>{{ disabledCode }}</code></pre>
      </section>

      <!-- ── Real-world Example ────────────────────────────── -->
      <section class="section">
        <h2>Real-world Example</h2>
        <p>Scroll down to see the "Back to Top" button in action</p>
        <div class="demo-box" style="position: relative; height: 500px; overflow-y: auto; background: linear-gradient(to bottom, #fef3c7, #fde68a, #fbbf24, #f59e0b);">
          <div style="padding: 40px 20px; height: 1200px;">
            <h3 style="text-align: center; margin-bottom: 20px;">Long Content</h3>
            @for (item of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]; track item) {
              <p style="margin: 20px 0; padding: 16px; background: rgba(255, 255, 255, 0.7); border-radius: 8px;">
                Section {{ item }} — Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            }
          </div>
          <a class="pk-float-btn pk-float-btn--bottom-right pk-float-btn--icon pk-float-btn--success" style="position: absolute;" (click)="scrollToTop($event)">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
          </a>
        </div>
        <pre><code>{{ exampleCode }}</code></pre>
      </section>

      <!-- ── Class Reference ───────────────────────────────── -->
      <section class="section">
        <h2>Class Reference</h2>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>pk-float-btn</code></td>
                <td>Base class (required)</td>
              </tr>
              <tr>
                <td colspan="2" style="background: #f8fafc; font-weight: 600;">Positions</td>
              </tr>
              <tr><td><code>pk-float-btn--top-left</code></td><td>Top-left corner</td></tr>
              <tr><td><code>pk-float-btn--top-center</code></td><td>Top center (default for demo)</td></tr>
              <tr><td><code>pk-float-btn--top-right</code></td><td>Top-right corner</td></tr>
              <tr><td><code>pk-float-btn--bottom-left</code></td><td>Bottom-left corner</td></tr>
              <tr><td><code>pk-float-btn--bottom-center</code></td><td>Bottom center</td></tr>
              <tr><td><code>pk-float-btn--bottom-right</code></td><td>Bottom-right corner (FAB position)</td></tr>
              <tr>
                <td colspan="2" style="background: #f8fafc; font-weight: 600;">Colors</td>
              </tr>
              <tr><td><code>pk-float-btn--secondary</code></td><td>Gray variant</td></tr>
              <tr><td><code>pk-float-btn--success</code></td><td>Green variant</td></tr>
              <tr><td><code>pk-float-btn--error</code></td><td>Red variant</td></tr>
              <tr><td><code>pk-float-btn--warning</code></td><td>Orange variant</td></tr>
              <tr><td><code>pk-float-btn--info</code></td><td>Cyan variant</td></tr>
              <tr><td><code>pk-float-btn--dark</code></td><td>Dark variant</td></tr>
              <tr>
                <td colspan="2" style="background: #f8fafc; font-weight: 600;">Sizes</td>
              </tr>
              <tr><td><code>pk-float-btn--sm</code></td><td>Small (6px/12px padding, 11px font)</td></tr>
              <tr><td><code>pk-float-btn--lg</code></td><td>Large (12px/20px padding, 15px font)</td></tr>
              <tr>
                <td colspan="2" style="background: #f8fafc; font-weight: 600;">Modifiers</td>
              </tr>
              <tr><td><code>pk-float-btn--icon</code></td><td>Circular icon-only button</td></tr>
              <tr><td><code>pk-float-btn--disabled</code></td><td>Disabled state (or use <code>disabled</code> attribute)</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- ── Features ──────────────────────────────────────── -->
      <section class="section">
        <h2>Features</h2>
        <ul>
          <li><strong>Pure CSS</strong> — no JavaScript, no Angular component</li>
          <li><strong>Backdrop blur</strong> — glassmorphism effect (<code>backdrop-filter: blur(6px)</code>)</li>
          <li><strong>Smooth transitions</strong> — hover, active states with translateY animation</li>
          <li><strong>Accessible</strong> — works with <code>&lt;a&gt;</code>, <code>&lt;button&gt;</code></li>
          <li><strong>Fixed positioning</strong> — stays visible while scrolling (z-index: 9999)</li>
          <li><strong>Responsive</strong> — works on mobile and desktop</li>
        </ul>
      </section>

      <!-- ── Notes ─────────────────────────────────────────── -->
      <section class="section">
        <h2>Notes</h2>
        <ul>
          <li>Position modifiers use <code>position: fixed</code> — button stays in viewport during scroll</li>
          <li>For icon-only buttons, use SVG icons with explicit width/height</li>
          <li>The <code>--icon</code> modifier creates a circular button (50% border-radius)</li>
          <li>Combine modifiers freely: <code>pk-float-btn pk-float-btn--bottom-right pk-float-btn--lg pk-float-btn--success pk-float-btn--icon</code></li>
        </ul>
      </section>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 900px;
      margin: 0 0;
      padding: 0px 0px;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
    }

    .page-subtitle {
      font-size: 1.125rem;
      color: #64748b;
      margin-bottom: 40px;
    }

    .section {
      margin-bottom: 48px;
    }

    .section h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #334155;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }

    .section p {
      color: #475569;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .section ul {
      color: #475569;
      line-height: 1.8;
      padding-left: 24px;
    }

    .section ul li {
      margin-bottom: 8px;
    }

    .demo-box {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 16px;
      background: #ffffff;
    }

    pre {
      background: #1e293b;
      color: #e2e8f0;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
      font-size: 13px;
      line-height: 1.6;
    }

    code {
      font-family: 'Monaco', 'Menlo', monospace;
    }

    p code, li code, td code {
      background: #f1f5f9;
      color: #e11d48;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.9em;
    }

    .table-responsive {
      overflow-x: auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }

    .table th,
    .table td {
      text-align: left;
      padding: 12px;
      border: 1px solid #e2e8f0;
    }

    .table th {
      background: #f8fafc;
      font-weight: 600;
      color: #334155;
    }

    .table td {
      color: #475569;
    }

    .table tbody tr:hover {
      background: #f8fafc;
    }
  `]
})
export class PkFloatBtnComponent {
  readonly installCode = `// angular.json
"styles": ["node_modules/ngx-pk-ui/styles/pk-ui.css"]

// Or CSS import
@import 'ngx-pk-ui/styles/pk-ui.css';`;

  readonly basicCode = `<a class="pk-float-btn pk-float-btn--top-center" routerLink="/home">
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
  Back
</a>`;

  readonly positionsCode = `<!-- Top -->
<a class="pk-float-btn pk-float-btn--top-left">Top Left</a>
<a class="pk-float-btn pk-float-btn--top-center">Top Center</a>
<a class="pk-float-btn pk-float-btn--top-right">Top Right</a>

<!-- Bottom -->
<a class="pk-float-btn pk-float-btn--bottom-left">Bottom Left</a>
<a class="pk-float-btn pk-float-btn--bottom-center">Bottom Center</a>
<a class="pk-float-btn pk-float-btn--bottom-right">Bottom Right</a>`;

  readonly colorsCode = `<a class="pk-float-btn">Primary (default)</a>
<a class="pk-float-btn pk-float-btn--secondary">Secondary</a>
<a class="pk-float-btn pk-float-btn--success">Success</a>
<a class="pk-float-btn pk-float-btn--error">Error</a>
<a class="pk-float-btn pk-float-btn--warning">Warning</a>
<a class="pk-float-btn pk-float-btn--info">Info</a>
<a class="pk-float-btn pk-float-btn--dark">Dark</a>`;

  readonly sizesCode = `<a class="pk-float-btn pk-float-btn--sm">Small</a>
<a class="pk-float-btn">Medium (default)</a>
<a class="pk-float-btn pk-float-btn--lg">Large</a>`;

  readonly iconOnlyCode = `<!-- Icon-only circular buttons -->
<a class="pk-float-btn pk-float-btn--icon pk-float-btn--sm">
  <svg viewBox="0 0 24 24" width="18" height="18">...</svg>
</a>

<a class="pk-float-btn pk-float-btn--icon">
  <svg viewBox="0 0 24 24" width="20" height="20">...</svg>
</a>

<a class="pk-float-btn pk-float-btn--icon pk-float-btn--lg">
  <svg viewBox="0 0 24 24" width="24" height="24">...</svg>
</a>`;

  readonly disabledCode = `<!-- Class-based -->
<a class="pk-float-btn pk-float-btn--disabled">Disabled</a>

<!-- Attribute (for button) -->
<button class="pk-float-btn" disabled>Disabled</button>`;

  readonly exampleCode = `<!-- Back to top button -->
<a class="pk-float-btn pk-float-btn--bottom-right pk-float-btn--icon pk-float-btn--success"
   (click)="scrollToTop()">
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
</a>`;

  scrollToTop(event: MouseEvent): void {
    event.preventDefault();
    const demoBox = (event.target as HTMLElement).closest('.demo-box');
    if (demoBox) {
      demoBox.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
