// DOM Elements
const videoUrlInput = document.getElementById('videoUrl');
const qualitySelect = document.getElementById('quality');
const removeWatermarkCheckbox = document.getElementById('removeWatermark');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const statusMessage = document.getElementById('statusMessage');
const loadingSpinner = document.getElementById('loadingSpinner');

const API_BASE_URL = '/api';

// Show status
function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.classList.remove('hidden');
}

// Hide status
function hideStatus() {
    statusMessage.classList.add('hidden');
}

// Show loading
function showLoading() {
    loadingSpinner.classList.remove('hidden');
}

// Hide loading
function hideLoading() {
    loadingSpinner.classList.add('hidden');
}

// Clear inputs
function clearInputs() {
    videoUrlInput.value = '';
    qualitySelect.value = 'best';
    removeWatermarkCheckbox.checked = false;
    hideStatus();
    hideLoading();
}

// Detect platform
function detectPlatform(url) {
    if (url.includes('tiktok.com') || url.includes('vm.tiktok.com')) return 'TikTok';
    if (url.includes('instagram.com') || url.includes('instagr.am')) return 'Instagram';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'Facebook';
    return 'Unknown';
}

// Download video
async function downloadVideo() {
    const url = videoUrlInput.value.trim();
    const quality = qualitySelect.value;
    const removeWatermark = removeWatermarkCheckbox.checked;

    if (!url) {
        showStatus('❌ Masukkan URL video!', 'error');
        return;
    }

    if (!url.startsWith('http')) {
        showStatus('❌ URL harus dimulai dengan http:// atau https://', 'error');
        return;
    }

    const platform = detectPlatform(url);
    if (platform === 'Unknown') {
        showStatus('❌ Platform tidak didukung', 'error');
        return;
    }

    showLoading();
    showStatus(`⏳ Mengunduh dari ${platform}...`, 'info');
    downloadBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/download`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, quality, removeWatermark })
        });

        const data = await response.json();

        if (data.success) {
            showStatus(`✅ Sukses! Video dari ${platform} telah diunduh.`, 'success');
            setTimeout(() => {
                videoUrlInput.value = '';
                hideStatus();
            }, 3000);
        } else {
            showStatus(`❌ Error: ${data.message}`, 'error');
        }
    } catch (error) {
        showStatus(`❌ Gagal: ${error.message}`, 'error');
    } finally {
        hideLoading();
        downloadBtn.disabled = false;
    }
}

// Event listeners
downloadBtn.addEventListener('click', downloadVideo);
clearBtn.addEventListener('click', clearInputs);

videoUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        downloadVideo();
    }
});

// Check API on load
window.addEventListener('load', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        if (data.success) {
            console.log('[✓] Server ready');
        }
    } catch (error) {
        showStatus('⚠️ Koneksi server gagal', 'error');
    }
});
