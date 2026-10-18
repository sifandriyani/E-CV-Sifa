/* =====================================================
   MOBILE MENU
   (dijaga dengan pengecekan null karena halaman hero
   saat ini belum punya navbar/menu-toggle)
===================================================== */

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("open");

    });


    /* Close mobile menu after clicking */

    document.querySelectorAll(".nav-menu a").forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("open");

        });

    });

}


/* =====================================================
   ANIMASI KETIK (TYPEWRITER)
   - "Hi I'm, Sifa Andriyani" -> ngetik sekali, muncul pas discroll
   - Note bio -> ngetik dari awal sampai akhir, jeda, ngetik lagi (loop)
===================================================== */

const greetTextEl = document.querySelector(".about-greet-text");
const aboutNameEl = document.querySelector(".about-name");
const noteTextEl = document.querySelector(".note-text");

/* Simpan teks aslinya dulu, lalu kosongkan elemennya supaya nanti
   bisa "diketik" ulang huruf demi huruf lewat JS. Teks asli di HTML
   tetap dipertahankan sebagai sumber datanya (tidak dihapus dari
   markup), cuma tampilannya yang dikosongkan sementara oleh JS ini. */

const greetOriginalText =
    greetTextEl ? greetTextEl.textContent.trim() : "";

const aboutNameOriginalText =
    aboutNameEl ? aboutNameEl.textContent.trim() : "";

const noteOriginalText =
    noteTextEl ? noteTextEl.textContent.trim() : "";

if (greetTextEl) greetTextEl.textContent = "";
if (aboutNameEl) aboutNameEl.textContent = "";
if (noteTextEl) noteTextEl.textContent = "";


/* Fungsi umum: ngetikin teks huruf demi huruf ke sebuah elemen */

function typeText(element, text, speed, onDone) {

    if (!element) return;

    let index = 0;

    element.classList.add("typing-cursor");

    (function typeNextChar() {

        if (index <= text.length) {

            element.textContent = text.slice(0, index);

            index++;

            setTimeout(typeNextChar, speed);

        } else {

            element.classList.remove("typing-cursor");

            if (onDone) onDone();

        }

    })();

}


/* "Hi I'm," ketik dulu, baru lanjut "Sifa Andriyani".
   Cuma jalan sekali (dipicu pas discroll masuk layar). */

let headingTypingStarted = false;

function startHeadingTyping() {

    if (headingTypingStarted) return;

    headingTypingStarted = true;

    typeText(greetTextEl, greetOriginalText, 55, () => {

        typeText(aboutNameEl, aboutNameOriginalText, 65);

    });

}


/* Note bio: ketik dari awal sampai akhir, jeda sebentar,
   lalu dihapus dan diketik ulang dari awal lagi -> looping terus. */

function runNoteTypingLoop() {

    if (!noteTextEl) return;

    typeText(noteTextEl, noteOriginalText, 18, () => {

        setTimeout(() => {

            noteTextEl.textContent = "";

            runNoteTypingLoop();

        }, 1800); // jeda sebelum ngetik ulang

    });

}

let noteTypingStarted = false;

function startNoteTyping() {

    if (noteTypingStarted) return;

    noteTypingStarted = true;

    runNoteTypingLoop();

}


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements =
    document.querySelectorAll(
        /* .cert-card ikutan di sini biar kartu Sertifikat
           kena class "show" pas discroll masuk layar -
           animasi "stamp"-nya sendiri diatur di CSS
           (.cert-card / .cert-card.show) */
        ".reveal, .reveal-left, .cert-card, .project-reveal"
    );


const observer = new IntersectionObserver(

    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                /* Begitu blok "Hi I'm, Sifa Andriyani" + note kelihatan
                   pas discroll, mulai animasi ketiknya */

                if (entry.target.classList.contains("about-profile")) {

                    startHeadingTyping();

                    startNoteTyping();

                }

                observer.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.15
    }

);


revealElements.forEach((element) => {

    observer.observe(element);

});


/* =====================================================
   EXPERIENCE - GARIS TIMELINE "TERGAMBAR"

   Garis birunya (.timeline-line-fill) ketinggiannya
   (height, dalam %) diitung ulang tiap discroll,
   berdasarkan seberapa jauh "garis baca" (kira-kira
   tengah layar) udah masuk ke area timeline. Titik
   di tiap kartu (.exp-dot) ikutan nyala begitu garis
   fill-nya udah lewatin posisi kartu itu. */

const timelineFill =
    document.querySelector(".timeline-line-fill");

const expTimeline =
    document.querySelector(".experience-timeline");

const expDots =
    document.querySelectorAll(".exp-dot");

if (timelineFill && expTimeline) {

    let timelineTicking = false;

    function updateTimeline() {

        const rect =
            expTimeline.getBoundingClientRect();

        /* "Garis baca" ditaruh di tengah layar - progress
           dihitung dari seberapa jauh garis itu udah masuk
           ke tinggi area timeline (0 = belum mulai, 1 = udah
           lewatin semua kartu) */

        const readLine = window.innerHeight * 0.5;

        let progress = (readLine - rect.top) / rect.height;

        progress = Math.max(0, Math.min(1, progress));

        timelineFill.style.height = (progress * 100) + "%";

        expDots.forEach((dot) => {

            const dotTop =
                dot.getBoundingClientRect().top;

            if (dotTop <= readLine) {

                dot.classList.add("reached");

            } else {

                dot.classList.remove("reached");

            }

        });

        timelineTicking = false;

    }

    function requestTimelineUpdate() {

        if (!timelineTicking) {

            requestAnimationFrame(updateTimeline);

            timelineTicking = true;

        }

    }

    window.addEventListener("scroll", requestTimelineUpdate, { passive: true });
    window.addEventListener("resize", requestTimelineUpdate);

    updateTimeline();

}


/* =====================================================
   PROJECT - KARTU BERTUMPUK (STACKED CARDS)

   Sama persis pola yang sebelumnya dipakai di Experience:
   tumpukannya kejadian dari CSS (position: sticky di
   .project-card), JS ini cuma nambahin class "is-behind"
   ke kartu yang udah nyaris ketiban kartu berikutnya,
   dicek dari posisi ASLI tiap kartu (bukan nebak pakai
   IntersectionObserver), biar kartu yang masih jadi
   "kepala tumpukan" ga ikut kena efek mengecilnya. */

const projectCards =
    document.querySelectorAll(".project-card");

if (projectCards.length > 0) {

    let projectTicking = false;

    function updateProjectStack() {

        projectCards.forEach((card, idx) => {

            const nextCard = projectCards[idx + 1];

            if (!nextCard) {

                card.classList.remove("is-behind");

                return;

            }

            const cardTop =
                card.getBoundingClientRect().top;

            const nextTop =
                nextCard.getBoundingClientRect().top;

            if (nextTop - cardTop < 36) {

                card.classList.add("is-behind");

            } else {

                card.classList.remove("is-behind");

            }

        });

        projectTicking = false;

    }

    function requestProjectUpdate() {

        if (!projectTicking) {

            requestAnimationFrame(updateProjectStack);

            projectTicking = true;

        }

    }

    window.addEventListener("scroll", requestProjectUpdate, { passive: true });
    window.addEventListener("resize", requestProjectUpdate);

    updateProjectStack();

}


/* =====================================================
   ACTIVE NAVBAR
===================================================== */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".bottom-nav-link");


window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
            sectionTop + sectionHeight
        ) {

            current = section.getAttribute("id");

        }

    });


    navLinks.forEach((link) => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {

            link.classList.add("active");

        }

    });

});