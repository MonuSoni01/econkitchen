document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("econShutterForm");
    const track = document.getElementById("shFinishTrack");
    const pauseBtn = document.getElementById("shFinishPause");

    // Finish slider pause / resume
    if (track && pauseBtn) {
        pauseBtn.addEventListener("click", () => {
            const paused = track.classList.toggle("paused");
            pauseBtn.innerHTML = paused
                ? 'Resume Slider <i class="fa-solid fa-play"></i>'
                : 'Pause Slider <i class="fa-solid fa-pause"></i>';
        });
    }

    // Demo B2B form handling
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            let toast = document.querySelector(".sh-toast");
            if (!toast) {
                toast = document.createElement("div");
                toast.className = "sh-toast";
                toast.style.cssText = `
                    position:fixed;
                    right:22px;
                    bottom:22px;
                    z-index:99999;
                    max-width:360px;
                    padding:16px 18px;
                    border:1px solid rgba(212,175,55,.45);
                    border-radius:14px;
                    background:#111;
                    color:#fff;
                    font:500 13px/1.55 "Poppins",sans-serif;
                    box-shadow:0 20px 60px rgba(0,0,0,.28);
                `;
                document.body.appendChild(toast);
            }

            toast.textContent = "Demo enquiry captured. Connect this form with your CRM / WhatsApp / API before going live.";

            clearTimeout(window.econShutterToastTimer);
            window.econShutterToastTimer = setTimeout(() => toast.remove(), 4200);
        });
    }
});
