document.addEventListener('DOMContentLoaded', () => {

  // ------------- LAB DATA -------------
  const labs = {
    lab1: {
      name: "Apple Lab",
      location: "Block A, 1st  Floor Main building",
      image: "images/lab1.jpg"
    },
    lab2: {
      name: "Physics Lab",
      location: "Block B, Fist Floor Mechanical building",
      image: "images/lab2.jpg"
    },
    lab3: {
      name: "Chemistry lab",
      location: "Block C, Ground Floor Main building",
      image: "images/lab3.jpg"
    },
    lab4: {
      name: "Computer lab 3&4",
      location: "Block A, 2nd Floor Main building",
      image: "images/lab4.jpg"
    },
    lab5: {
      name: "Computer lab 5&6",
      location: "Block D, 3rd Floor Main building",
      image: "images/lab5.jpg"
    },
    lab6: {
      name: "Computer lab 7&8",
      location: "Block E, 3rd Floor Main building",
      image: "images/lab6.jpg"
    },
    lab7: {
      name: "IDAE Lab",
      location: "Block F, 3rd Floor Main building",
      image: "images/lab7.jpg"
    }
  };

  // ------------- DOM REFERENCES -------------
  const selectEl = document.getElementById('labSelect');
  const generateBtn = document.getElementById('generateBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const imagePanel = document.getElementById('imagePanel');
  const qrcodeDiv = document.getElementById('qrcode');
  const qrPlaceholder = document.getElementById('qrPlaceholder');

  // ensure required elements exist
  if (!selectEl || !generateBtn || !downloadBtn || !imagePanel || !qrcodeDiv || !qrPlaceholder) {
    console.error('Missing DOM elements. Make sure IDs match index.html.');
    return;
  }

  // Keep reference to QR instance and last selected lab
  let qrInstance = null;
  let lastLabKey = null;

  // ------------- Helpers -------------
  function labKeyToText(labKey) {
    const lab = labs[labKey];
    if (!lab) return '';
    // Use template literal (must be inside backticks)
    return `${lab.name}
Location: ${lab.location}

`;
  }

  function showImage(labKey) {
    imagePanel.innerHTML = '';
    const lab = labs[labKey];
    if (!lab || !lab.image) {
      // placeholder
      const placeholder = document.createElement('div');
      placeholder.style.width = '100%';
      placeholder.style.minHeight = '140px';
      placeholder.style.display = 'flex';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      placeholder.style.color = '#6b7280';
      placeholder.textContent = 'No image available';
      imagePanel.appendChild(placeholder);
      return;
    }

    const img = document.createElement('img');
    img.alt = lab.name;
    img.src = lab.image;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';

    // fallback to SVG placeholder if image fails
    img.onerror = function () {
      this.onerror = null;
      this.src = createPlaceholderSvgDataUrl(lab.name);
    };
    imagePanel.appendChild(img);
  }

  function createPlaceholderSvgDataUrl(title) {
    const initials = (title || '').split(' ')
      .slice(0, 2)
      .map(s => s.charAt(0))
      .join('')
      .toUpperCase() || 'LB';

    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'>
      <rect width='100%' height='100%' fill='#f3f7ff'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='72' fill='#7c3aed' font-family='Arial, sans-serif'>${escapeXml(initials)}</text>
    </svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  function escapeXml(s) {
    return String(s || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  // Clear QR area and show placeholder (user must click Generate to create QR)
  function resetQrArea() {
    qrcodeDiv.innerHTML = '';
    qrcodeDiv.style.display = 'none';
    qrPlaceholder.style.display = 'flex';
    if (qrInstance && typeof qrInstance.clear === 'function') {
      try { qrInstance.clear(); } catch (_) { /* ignore */ }
    }
    qrInstance = null;
    downloadBtn.disabled = true;
  }

  // Create QR using qrcode.min.js (produces <img> or <canvas> inside qrcodeDiv)
  function createQrForLab(labKey) {
    // remove previous QR nodes
    qrcodeDiv.innerHTML = '';
    qrcodeDiv.style.display = 'flex';
    qrPlaceholder.style.display = 'none';

    const payload = labKeyToText(labKey);
    // create an element to hold QR
    const holder = document.createElement('div');
    qrcodeDiv.appendChild(holder);

    // Create QR instance (qrcode.min.js library must be present)
    try {
      // If a previous instance exists, try to clear it
      if (qrInstance && typeof qrInstance.clear === 'function') {
        try { qrInstance.clear(); } catch (_) { }
      }
      qrInstance = new QRCode(holder, {
        text: payload,
        width: 260,
        height: 260,
        correctLevel: QRCode.CorrectLevel.H
      });
      lastLabKey = labKey;
      // enable download after slight delay to ensure rendering
      setTimeout(() => { downloadBtn.disabled = false; }, 150);
    } catch (err) {
      console.error('Error creating QR (QRCode lib may be missing):', err);
      qrcodeDiv.innerHTML = 'Error generating QR';
      downloadBtn.disabled = true;
    }
  }

  // Download current generated QR as PNG
  async function downloadCurrentQr() {
    // find <img> or <canvas> inside qrcodeDiv
    const img = qrcodeDiv.querySelector('img');
    const filename = `${lastLabKey || 'lab'}-qr.png`;

    if (img && img.src) {
      // If img.src is a data URL, simply download
      if (img.src.startsWith('data:')) {
        triggerDownload(img.src, filename);
        return;
      }
      // If img.src is an external url, try fetch and download blob
      try {
        const resp = await fetch(img.src, { mode: 'cors' });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        triggerDownload(url, filename);
        // revoke after a short delay so browser can start download
        setTimeout(() => URL.revokeObjectURL(url), 1500);
        return;
      } catch (err) {
        console.error('Failed to fetch external QR image for download:', err);
        // fallback: open image in new tab for manual save
        try {
          window.open(img.src, '_blank', 'noopener');
        } catch (e) {
          alert('Download failed — unable to fetch QR image and cannot open the image in a new tab.');
        }
        return;
      }
    }

    // If canvas present, convert to blob and download
    const canvas = qrcodeDiv.querySelector('canvas');
    if (canvas) {
      canvas.toBlob((blob) => {
        if (!blob) {
          alert('Failed to export QR as PNG.');
          return;
        }
        const url = URL.createObjectURL(blob);
        triggerDownload(url, filename);
        setTimeout(() => URL.revokeObjectURL(url), 1500);
      }, 'image/png');
      return;
    }

    alert('No QR available to download. Please generate a QR first.');
  }

  function triggerDownload(dataUrlOrObjectUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrlOrObjectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // ------------- Events -------------
  // initial UI state
  resetQrArea();
  showImage(selectEl.value);

  // on selection change: show image and reset qr area
  selectEl.addEventListener('change', () => {
    showImage(selectEl.value);
    resetQrArea();
  });

  // generate button
  generateBtn.addEventListener('click', () => {
    const labKey = selectEl.value;
    if (!labKey || !labs[labKey]) {
      alert('Please select a lab first.');
      return;
    }
    // create QR
    createQrForLab(labKey);
  });

  // download button
  downloadBtn.addEventListener('click', async () => {
    await downloadCurrentQr();
  });

});
