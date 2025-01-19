// TODO: Indicar dónde está cada botón

export default (ctx) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Google Forms Hook Setup</title>
    <style>
        :root {
          --main-color: ${ctx.color || '#f39c12'};
          --gray-color: #ccc;
        }

        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f4f4f4;
        }

        .container {
          display: flex;
          gap: 2rem;
          height: 70vh;
          overflow-y: clip;
        }

        .progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .progress-point {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--gray-color);
          background: transparent;
          position: relative;
          margin: 5px 0;
          transition: border 0.3s ease;
          box-sizing: border-box;
          flex: none;
        }

        .progress-point.completed {
          border-color: var(--main-color);
        }

        .progress-point.active {
          border-width: 4px;
        }

        .progress-line {
          width: 4px;
          height: 100%;
          background: var(--gray-color);
          position: relative;
          margin: 0;
          overflow: hidden;
          opacity: 0.7;
        }

        .progress-line::after {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--main-color);
          transition: bottom 0.5s ease;
        }

        .progress-line.completed::after {
          bottom: 0;
        }

        .accordion {
          flex: 1;
          max-height: 0;
          overflow-y: auto;
          transition: max-height 0.5s ease-out, padding 0.3s ease-out, margin 0.3s ease-out;
          margin: 0;
          padding: 0 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          max-width: 600px;
        }

        .accordion.active {
          max-height: calc(70vh - 60px);
          padding: 20px;
          margin: 10px 0;
        }

        .input-with-prefix {
          display: flex;
          align-items: center;
          font-size: 14px;
          gap: 2px;
          margin: 10px 0;
          border-radius: 8px;
          border: 2px solid rgba(0, 0, 0, 0.1);
          padding: 4px;
          transition: border 0.1s ease-in;
        }

        .input-with-prefix:has(:focus-visible) {
          border: 2px solid #000;
        }

        .input-with-prefix span {
          opacity: 0.5;
        }

        .input-with-prefix input {
          flex: 1;
          border: none;
          outline: none;
          padding: 0;
          font-family: Arial, sans-serif;
          font-size: 14px;
        }

        .button-group {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }

        button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .btn-back {
          background: var(--gray-color);
          color: #000;
        }

        .btn-next {
          background: var(--main-color);
          color: #fff;
        }

        #idError {
          display: block;
          color: red;
          max-height: 0;
          overflow-y: hidden;
          transition: max-height 0.3s ease-out;
        }

        #idError.active {
          max-height: 40px;
        }

        .code-block-container {
          position: relative;
        }

        .code-block {
          padding: 10px;
          border-radius: 8px;
          overflow-x: auto;
          font-family: monospace;
          color: rgb(192, 197, 206);
          font-weight: 400;
          background: rgb(43, 48, 59);
          font-size: 13px;
        }

        .copy-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: #444;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 0 10px;
          cursor: pointer;
          font-size: 12px;
          transition: background-color 0.3s ease;
        }

        .copy-btn:hover {
          background-color: #666;
        }

        .hljs-comment,
        .hljs-quote {
          color: #65737e;
        }

        .hljs-deletion,
        .hljs-name,
        .hljs-regexp,
        .hljs-selector-class,
        .hljs-selector-id,
        .hljs-tag,
        .hljs-template-variable,
        .hljs-variable {
          color: #bf616a;
        }

        .hljs-built_in,
        .hljs-builtin-name,
        .hljs-link,
        .hljs-literal,
        .hljs-meta,
        .hljs-number,
        .hljs-params,
        .hljs-type {
          color: #d08770;
        }

        .hljs-attribute {
          color: #ebcb8b;
        }

        .hljs-addition,
        .hljs-bullet,
        .hljs-string,
        .hljs-symbol {
          color: #a3be8c;
        }

        .hljs-section,
        .hljs-title {
          color: #8fa1b3;
        }

        .hljs-keyword,
        .hljs-selector-tag {
          color: #b48ead;
        }

        .hljs {
          display: block;
          overflow-x: auto;
          background: #2b303b;
          color: #c0c5ce;
          padding: 0.5em;
        }

        .hljs-emphasis {
          font-style: italic;
        }

        .hljs-strong {
          font-weight: 700;
        }

        #keyReplace {
          color: #000;
          background-color: #000;
          border-radius: 8px;
        }

        #keyReplace::-moz-selection {
          color: #888;
          background-color: #888;
        }

        #keyReplace::selection {
          color: #888;
          background-color: #888;
        }

        .code-input {
        display: flex;
        gap: 8px;
        justify-content: center;
        margin-top: 10px;
      }

      .code-input input {
        width: 40px;
        height: 40px;
        text-align: center;
        font-size: 18px;
        border: 2px solid var(--gray-color);
        border-radius: 4px;
        outline: none;
        transition: border 0.2s ease-in-out;
      }

      .code-input input:focus {
        border-color: var(--main-color);
      }

      .code-input input::-webkit-outer-spin-button,
      .code-input input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      .code-input input[type="number"] {
        appearance: textfield;
        -moz-appearance: textfield;
      }

      #codeError {
        display: block;
        color: red;
        max-height: 0;
        overflow-y: hidden;
        margin-top: 0;
        text-align: center;
        transition: max-height 0.3s ease-out, margin-top 0.3s ease-out;
      }

      #codeError.active {
        max-height: 20px;
        margin-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="progress">
        <div class="progress-point active completed" id="point1"></div>
        <div class="progress-line" id="line1"></div>
        <div class="progress-point" id="point2"></div>
        <div class="progress-line" id="line2"></div>
        <div class="progress-point" id="point3"></div>
      </div>
      <form id="processForm">
        <div id="step1" class="accordion active">
          <p>Ve al form que quieres conectar, haz click en los 3 puntos (︙) y entra en "Editor de secuencias de comandos".</p>
          <div class="button-group">
            <button type="button" class="btn-next" onclick="goToStep(2)">Next</button>
          </div>
        </div>
        <div id="step2" class="accordion">
          <p>Copia este código y pégalo en el editor de secuencias de comandos (reemplaza el código actual). Asegúrate de guardar el archivo.</p>
          <!-- https://codebeautify.org/code-highlighter - Ocean -->
          <div class="code-block-container">
            <pre class="code-block">
<span style="color:rgb(180, 142, 173); font-weight:400;">function</span> <span class="hljs-title function_">validateForm</span>(<span style="color:rgb(208, 135, 112); font-weight:400;"></span>) {
  <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> form = <span class="hljs-title class_">FormApp</span>.<span class="hljs-title function_">getActiveForm</span>();
  <span style="color:rgb(180, 142, 173); font-weight:400;">if</span> (!form) {
    <span class="hljs-title class_">Logger</span>.<span class="hljs-title function_">log</span>(<span style="color:rgb(163, 190, 140); font-weight:400;">&quot;No active form found.&quot;</span>);
    <span style="color:rgb(180, 142, 173); font-weight:400;">return</span>;
  }
    
  <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> formData = <span class="hljs-title function_">extractFormData</span>(form);
    
  <span style="color:rgb(180, 142, 173); font-weight:400;">if</span> (!<span class="hljs-title function_">isTriggerRegistered</span>(<span style="color:rgb(163, 190, 140); font-weight:400;">&quot;onFormSubmit&quot;</span>)) {
    <span class="hljs-title class_">Logger</span>.<span class="hljs-title function_">log</span>(<span style="color:rgb(163, 190, 140); font-weight:400;">&quot;You must register a trigger for &#x27;onFormSubmit&#x27; before proceeding.&quot;</span>);
    <span style="color:rgb(180, 142, 173); font-weight:400;">return</span>;
  }
    
  <span style="color:rgb(180, 142, 173); font-weight:400;">try</span> {
    <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> code = <span class="hljs-title function_">generateCode</span>();
    <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> payload = <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>({ code, formData, <span style="color:rgb(192, 197, 206); font-weight:400;">key</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;<span id="keyReplace">${
			ctx.key
		}</span>&quot;</span> });
    <span class="hljs-title function_">sendPostRequest</span>(<span style="color:rgb(163, 190, 140); font-weight:400;">&quot;register&quot;</span>, payload);
    <span class="hljs-title class_">Logger</span>.<span class="hljs-title function_">log</span>(<span style="color:rgb(163, 190, 140); font-weight:400;">\`Your code is <span style="color:rgb(163, 190, 140); font-weight:400;">\${code}</span>\`</span>);
  } <span style="color:rgb(180, 142, 173); font-weight:400;">catch</span> (error) {
    <span class="hljs-title class_">Logger</span>.<span class="hljs-title function_">log</span>(<span style="color:rgb(163, 190, 140); font-weight:400;">\`Error: <span style="color:rgb(163, 190, 140); font-weight:400;">\${error.toString()}</span>\`</span>);
  }
}
    
<span style="color:rgb(180, 142, 173); font-weight:400;">function</span> <span class="hljs-title function_">onFormSubmit</span>(<span style="color:rgb(208, 135, 112); font-weight:400;">e</span>) {
  <span style="color:rgb(180, 142, 173); font-weight:400;">if</span> (!e || !e.<span style="color:rgb(192, 197, 206); font-weight:400;">response</span>) {
    <span class="hljs-title class_">Logger</span>.<span class="hljs-title function_">log</span>(<span style="color:rgb(163, 190, 140); font-weight:400;">&quot;Invalid form submission event.&quot;</span>);
    <span style="color:rgb(180, 142, 173); font-weight:400;">return</span>;
  }
  
  <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> formResponse = e.<span style="color:rgb(192, 197, 206); font-weight:400;">response</span>;
  <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> responses = <span class="hljs-title function_">extractResponses</span>(formResponse);
  
  <span style="color:rgb(180, 142, 173); font-weight:400;">try</span> {
    <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> payload = <span class="hljs-title class_">JSON</span>.<span class="hljs-title function_">stringify</span>({ <span style="color:rgb(192, 197, 206); font-weight:400;">respondentEmail</span>: formResponse.<span class="hljs-title function_">getRespondentEmail</span>(), responses });
    <span class="hljs-title function_">sendPostRequest</span>(<span style="color:rgb(163, 190, 140); font-weight:400;">&quot;response&quot;</span>, payload);
  } <span style="color:rgb(180, 142, 173); font-weight:400;">catch</span> (error) {
    <span class="hljs-title class_">Logger</span>.<span class="hljs-title function_">log</span>(<span style="color:rgb(163, 190, 140); font-weight:400;">\`Error: <span style="color:rgb(163, 190, 140); font-weight:400;">\${error.toString()}</span>\`</span>);
  }
}
    
<span style="color:rgb(180, 142, 173); font-weight:400;">function</span> <span class="hljs-title function_">extractFormData</span>(<span style="color:rgb(208, 135, 112); font-weight:400;">form</span>) {
  <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> items = form.<span class="hljs-title function_">getItems</span>();
  <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> formData = [[form.<span class="hljs-title function_">getTitle</span>(), []]];
  
  items.<span class="hljs-title function_">forEach</span>(<span style="color:rgb(192, 197, 206); font-weight:400;">(<span style="color:rgb(208, 135, 112); font-weight:400;">item</span>) =&gt;</span> {
    <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> type = item.<span class="hljs-title function_">getType</span>().<span class="hljs-title function_">toString</span>();
    <span style="color:rgb(180, 142, 173); font-weight:400;">if</span> (type === <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;SECTION_HEADER&quot;</span>) <span style="color:rgb(180, 142, 173); font-weight:400;">return</span>;

    <span style="color:rgb(180, 142, 173); font-weight:400;">if</span> (type === <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;PAGE_BREAK&quot;</span>) {
      formData.<span class="hljs-title function_">push</span>([item.<span class="hljs-title function_">getTitle</span>(), []]);
      <span style="color:rgb(180, 142, 173); font-weight:400;">return</span>;
    }

    <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> question = <span class="hljs-title function_">buildQuestion</span>(item, type);
    <span style="color:rgb(180, 142, 173); font-weight:400;">if</span> (question) formData[formData.<span style="color:rgb(192, 197, 206); font-weight:400;">length</span> - <span style="color:rgb(208, 135, 112); font-weight:400;">1</span>][<span style="color:rgb(208, 135, 112); font-weight:400;">1</span>].<span class="hljs-title function_">push</span>(question);
  });
  
  <span style="color:rgb(180, 142, 173); font-weight:400;">return</span> formData;
}
    
<span style="color:rgb(180, 142, 173); font-weight:400;">function</span> <span class="hljs-title function_">buildQuestion</span>(<span style="color:rgb(208, 135, 112); font-weight:400;">item, type</span>) {
  <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> typeMapping = {
    <span style="color:rgb(192, 197, 206); font-weight:400;">MULTIPLE_CHOICE</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asMultipleChoiceItem&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">CHECKBOX</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asCheckboxItem&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">LIST</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asListItem&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">GRID</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asGridItem&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">CHECKBOX_GRID</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asCheckboxGridItem&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">TIME</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asTimeItem&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">DATE</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asDateItem&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">DATETIME</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asDateTimeItem&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">SCALE</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asScaleItem&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">RATING</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asRatingItem&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">TEXT</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asTextItem&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">PARAGRAPH_TEXT</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asParagraphTextItem&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">DURATION</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;asDurationItem&quot;</span>,
  };

  <span style="color:rgb(180, 142, 173); font-weight:400;">if</span> (!typeMapping[<span style="color:rgb(180, 142, 173); font-weight:400;">type</span>]) <span style="color:rgb(180, 142, 173); font-weight:400;">return</span> <span style="color:rgb(208, 135, 112); font-weight:400;">null</span>;

  <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> question = { <span style="color:rgb(192, 197, 206); font-weight:400;">id</span>: item.<span class="hljs-title function_">getId</span>(), <span style="color:rgb(192, 197, 206); font-weight:400;">title</span>: item.<span class="hljs-title function_">getTitle</span>(), <span style="color:rgb(192, 197, 206); font-weight:400;">description</span>: item.<span class="hljs-title function_">getHelpText</span>(), <span style="color:rgb(180, 142, 173); font-weight:400;">type</span> };
  <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> itemFunction = typeMapping[<span style="color:rgb(180, 142, 173); font-weight:400;">type</span>];

  <span style="color:rgb(180, 142, 173); font-weight:400;">switch</span> (<span style="color:rgb(180, 142, 173); font-weight:400;">type</span>) {
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;MULTIPLE_CHOICE&quot;</span>:
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;CHECKBOX&quot;</span>:
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;LIST&quot;</span>: {
      <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> specificItem = item[itemFunction]();
      question.<span style="color:rgb(192, 197, 206); font-weight:400;">options</span> = specificItem.<span class="hljs-title function_">getChoices</span>().<span class="hljs-title function_">map</span>(<span style="color:rgb(192, 197, 206); font-weight:400;">(<span style="color:rgb(208, 135, 112); font-weight:400;">choice</span>) =&gt;</span> choice.<span class="hljs-title function_">getValue</span>());
      question.<span style="color:rgb(192, 197, 206); font-weight:400;">required</span> = specificItem.<span class="hljs-title function_">isRequired</span>();
      <span style="color:rgb(180, 142, 173); font-weight:400;">break</span>;
    }
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;GRID&quot;</span>:
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;CHECKBOX_GRID&quot;</span>: {
      <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> specificItem = item[itemFunction]();
      question.<span style="color:rgb(192, 197, 206); font-weight:400;">rows</span> = specificItem.<span class="hljs-title function_">getRows</span>();
      question.<span style="color:rgb(192, 197, 206); font-weight:400;">columns</span> = specificItem.<span class="hljs-title function_">getColumns</span>();
      question.<span style="color:rgb(192, 197, 206); font-weight:400;">required</span> = specificItem.<span class="hljs-title function_">isRequired</span>();
      <span style="color:rgb(180, 142, 173); font-weight:400;">break</span>;
    }
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;TIME&quot;</span>:
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;DATE&quot;</span>:
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;DATETIME&quot;</span>:
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;SCALE&quot;</span>:
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;RATING&quot;</span>:
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;TEXT&quot;</span>:
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;PARAGRAPH_TEXT&quot;</span>:
    <span style="color:rgb(180, 142, 173); font-weight:400;">case</span> <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;DURATION&quot;</span>: {
      <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> specificItem = item[itemFunction]();
      question.<span style="color:rgb(192, 197, 206); font-weight:400;">required</span> = specificItem.<span class="hljs-title function_">isRequired</span>();
      <span style="color:rgb(180, 142, 173); font-weight:400;">break</span>;
    }
    <span style="color:rgb(192, 197, 206); font-weight:400;">default</span>:
      <span style="color:rgb(180, 142, 173); font-weight:400;">return</span> <span style="color:rgb(208, 135, 112); font-weight:400;">null</span>;
  }

  <span style="color:rgb(180, 142, 173); font-weight:400;">return</span> question;
}
    
<span style="color:rgb(180, 142, 173); font-weight:400;">function</span> <span class="hljs-title function_">extractResponses</span>(<span style="color:rgb(208, 135, 112); font-weight:400;">formResponse</span>) {
  <span style="color:rgb(180, 142, 173); font-weight:400;">return</span> formResponse.<span class="hljs-title function_">getItemResponses</span>().<span class="hljs-title function_">map</span>(<span style="color:rgb(192, 197, 206); font-weight:400;">(<span style="color:rgb(208, 135, 112); font-weight:400;">itemResponse</span>) =&gt;</span> {
    <span style="color:rgb(180, 142, 173); font-weight:400;">const</span> item = itemResponse.<span class="hljs-title function_">getItem</span>();
    <span style="color:rgb(180, 142, 173); font-weight:400;">return</span> {
      <span style="color:rgb(192, 197, 206); font-weight:400;">id</span>: item.<span class="hljs-title function_">getId</span>(),
      <span style="color:rgb(192, 197, 206); font-weight:400;">value</span>: itemResponse.<span class="hljs-title function_">getResponse</span>(),
    };
  });
}
    
<span style="color:rgb(180, 142, 173); font-weight:400;">function</span> <span class="hljs-title function_">isTriggerRegistered</span>(<span style="color:rgb(208, 135, 112); font-weight:400;">handlerFunction</span>) {
  <span style="color:rgb(180, 142, 173); font-weight:400;">return</span> <span class="hljs-title class_">ScriptApp</span>.<span class="hljs-title function_">getProjectTriggers</span>().<span class="hljs-title function_">some</span>(<span style="color:rgb(192, 197, 206); font-weight:400;">(<span style="color:rgb(208, 135, 112); font-weight:400;">trigger</span>) =&gt;</span>
    trigger.<span class="hljs-title function_">getHandlerFunction</span>() === handlerFunction &amp;&amp;
    trigger.<span class="hljs-title function_">getEventType</span>() === <span class="hljs-title class_">ScriptApp</span>.<span style="color:rgb(192, 197, 206); font-weight:400;">EventType</span>.<span style="color:rgb(192, 197, 206); font-weight:400;">ON_FORM_SUBMIT</span> &amp;&amp;
    trigger.<span class="hljs-title function_">getTriggerSource</span>() === <span class="hljs-title class_">ScriptApp</span>.<span style="color:rgb(192, 197, 206); font-weight:400;">TriggerSource</span>.<span style="color:rgb(192, 197, 206); font-weight:400;">FORMS</span>
  );
}
    
<span style="color:rgb(180, 142, 173); font-weight:400;">function</span> <span class="hljs-title function_">generateCode</span>(<span style="color:rgb(208, 135, 112); font-weight:400;"></span>) {
  <span style="color:rgb(180, 142, 173); font-weight:400;">return</span> <span class="hljs-title class_">Math</span>.<span class="hljs-title function_">floor</span>(<span class="hljs-title class_">Math</span>.<span class="hljs-title function_">random</span>() * <span style="color:rgb(208, 135, 112); font-weight:400;">1000000</span>).<span class="hljs-title function_">toString</span>().<span class="hljs-title function_">padStart</span>(<span style="color:rgb(208, 135, 112); font-weight:400;">6</span>, <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;0&quot;</span>);
}
    
<span style="color:rgb(180, 142, 173); font-weight:400;">function</span> <span class="hljs-title function_">sendPostRequest</span>(<span style="color:rgb(208, 135, 112); font-weight:400;">action, payload</span>) {
  <span class="hljs-title class_">UrlFetchApp</span>.<span class="hljs-title function_">fetch</span>(<span style="color:rgb(163, 190, 140); font-weight:400;">\`https://workers.tablerus.es/googleforms/v2/<span style="color:rgb(163, 190, 140); font-weight:400;">\${action}</span>\`</span>, {
    <span style="color:rgb(192, 197, 206); font-weight:400;">method</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;POST&quot;</span>,
    <span style="color:rgb(192, 197, 206); font-weight:400;">contentType</span>: <span style="color:rgb(163, 190, 140); font-weight:400;">&quot;application/json&quot;</span>,
    payload
  });
}</pre>
            <button type="button" class="copy-btn">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="18px" fill="currentColor"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" /></svg>
            </button>
          </div>
          <div class="button-group">
            <button type="button" class="btn-back" onclick="goToStep(1)">Back</button>
            <button type="button" class="btn-next" onclick="goToStep(3)">Next</button>
          </div>
        </div>
        <div id="step3" class="accordion">
          <p>
            Entra en la pestaña de activadores (
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#000" style="margin: 0 -3px -4px -3px">
              <path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Zm0-360Zm112 168 56-56-128-128v-184h-80v216l152 152ZM224-866l56 56-170 170-56-56 170-170Zm512 0 170 170-56 56-170-170 56-56ZM480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160Z" />
            </svg>
            ) y añade un activador sobre la función "onFormSubmit" con "Al enviarse el formulario" como tipo de evento.
          </p>
          <p>Después, vuelve a la pestaña de código, selecciona "validateForm" y ejecuta la función.</p>
          <p>Mira el código de 6 cifras de la consola y escríbelo aquí:</p>
          <div class="code-input">
            <input type="number" maxlength="1" id="code0" />
            <input type="number" maxlength="1" id="code1" />
            <input type="number" maxlength="1" id="code2" />
            <input type="number" maxlength="1" id="code3" />
            <input type="number" maxlength="1" id="code4" />
            <input type="number" maxlength="1" id="code5" />
          </div>
          <span id="codeError"></span>
          <div class="button-group">
            <button type="button" class="btn-back" onclick="goToStep(2)">Back</button>
            <button type="button" class="btn-next" onclick="submitCode()">Submit</button>
          </div>
        </div>
      </form>
    </div>

    <script>
      let activeStep = 1;
      const LAST_STEP = 3;

      document.querySelectorAll(".copy-btn").forEach((button) => {
        button.addEventListener("click", () => {
          const codeBlock = button.previousElementSibling;
          const textToCopy = codeBlock.textContent;
          const svgPath = button.querySelector("svg path");

          if (!button.resetPathTimeout) button.resetPathTimeout = null;

          navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
              svgPath.setAttribute("d", "M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Z");
              if (button.resetPathTimeout) clearTimeout(button.resetPathTimeout);
              button.resetPathTimeout = setTimeout(() => {
                svgPath.setAttribute("d", "M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z");
                button.resetPathTimeout = null;
              }, 2000);
            })
            .catch((err) => {
              console.error("Failed to copy text: ", err);
            });
        });
      });

      const inputs = document.querySelectorAll('.code-input input');

      inputs.forEach((input, idx) => {
        input.addEventListener('input', () => {
          input.value = input.value.slice(0, 1);
  
          if (input.value.length === 1 && idx < inputs.length - 1) inputs[idx + 1].select();
          if (idx === inputs.length - 1) input.blur();
        });
    
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            submitCode();
            e.preventDefault();
          } else if (e.key === 'Backspace' && !input.value && idx > 0) inputs[idx - 1].select();
          else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && idx >= 0) {
            if (e.key === 'ArrowLeft' && idx > 0) inputs[idx - 1].select();
            else if (e.key === 'ArrowRight' && idx < inputs.length - 1) inputs[idx + 1].select();
          }
        });
    
        input.addEventListener('focus', () => input.select());
      });

      document.addEventListener("keydown", (event) => {
        const activeAccordion = document.querySelector(".accordion.active");
        const textInputFocused = document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA";
        if (textInputFocused) return;

        switch (event.key) {
          case "ArrowLeft":
          case "ArrowUp":
            if (activeStep > 1 && activeStep <= LAST_STEP) goToStep(activeStep - 1);
            break;
          case "ArrowRight":
          case "ArrowDown":
            if (activeStep < LAST_STEP) goToStep(activeStep + 1);
            break;
          case "Enter":
            if (activeStep < LAST_STEP) goToStep(activeStep + 1);
            else if (activeStep === LAST_STEP) submitCode();
            break;
          default:
            break;
        }
      });

      function goToStep(step) {
        activeStep = step;
        document.activeElement.blur();

        const accordions = document.querySelectorAll(".accordion");
        const points = document.querySelectorAll(".progress-point");
        const lines = document.querySelectorAll(".progress-line");

        accordions.forEach((acc, index) => acc.classList.toggle("active", index + 1 === step));

        points.forEach((point, index) => {
          point.classList.remove("completed", "active");
          if (index + 1 === step) point.classList.add("active");
          if (index < step) point.classList.add("completed");
        });

        lines.forEach((line, index) => {
          line.classList.remove("completed");
          if (index < step - 1) line.classList.add("completed");
        });
      }

      function submitCode() {
        const code = Array.from(inputs).map(input => input.value).join('');

        if (code.length === 6) {
          fetch('https://workers.tablerus.es/googleforms/v2/validate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              key: '${ctx.key}',
              code,
            }),
          })
            .then(async (response) => {
              return { success: response.status === 200, message: await response.text() };
            })
            .then(data => {
              if (data.success) return submitForm();
              const error = document.querySelector("#codeError");
              error.textContent = data.message;
              error.classList.add("active");
            })
            .catch(err => console.error('Error:', err));
        }
      }

      function submitForm() {
        goToStep(LAST_STEP + 1);
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "center";
        div.style.alignItems = "center";
        div.style.height = "100%";
        div.style.width = "100%";
        const p = document.createElement("p");
        p.textContent = "El Form se ha registrado correctamente.";
        p.style.color = "var(--main-color)";
        p.style.fontWeight = "700";
        p.style.fontSize = "22px";
        div.appendChild(p);
        document.getElementById("processForm").appendChild(div)
      }
    </script>
  </body>
</html>
`;
