import { DownloadFormat } from "@/types/greeting-card";

interface ExportOptions {
  pixelRatio?: number;
  quality?: number;
  width?: number;
  height?: number;
}

/**
 * Memicu pengunduhan file dari data URL di browser
 */
export function downloadDataUrl(dataUrl: string, fileName: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Mengonversi elemen HTML greeting card menjadi file gambar PNG atau JPG dan mengunduhnya.
 * Menggunakan dynamic import untuk html-to-image agar aman dari SSR.
 */
export async function exportCardAsImage(
  element: HTMLElement,
  format: DownloadFormat,
  fileName: string,
  options?: ExportOptions
): Promise<string> {
  const pixelRatio = options?.pixelRatio ?? 2;
  const quality = options?.quality ?? 1.0;

  const exportConfig = {
    cacheBust: true,
    pixelRatio,
    quality,
    backgroundColor: "#FFFFFF",
    filter: (node: HTMLElement) => {
      // Abaikan elemen UI seperti toolbar atau border pembantu jika ada
      if (node.classList && node.classList.contains("no-export")) {
        return false;
      }
      return true;
    },
  };

  try {
    // Dynamic import library browser-only untuk menjamin stabilitas saat kompilasi
    const { toPng, toJpeg } = await import("html-to-image");
    let dataUrl: string;

    if (format === "jpg") {
      dataUrl = await toJpeg(element, exportConfig);
    } else {
      dataUrl = await toPng(element, exportConfig);
    }

    downloadDataUrl(dataUrl, fileName);
    return dataUrl;
  } catch (error) {
    console.warn("Gagal mengekspor via html-to-image, mencoba fallback canvas...", error);
    // Jalankan fallback canvas jika html-to-image mengalami kendala
    return exportCardViaCanvas(element, format, fileName);
  }
}

/**
 * Fallback generator menggunakan Native HTML5 Canvas 2D
 * Memastikan hasil download selalu berukuran tepat 1504 × 1007 piksel
 * dan nama pengguna ter-render dengan sempurna di posisi tengah.
 */
export async function exportCardViaCanvas(
  element: HTMLElement,
  format: DownloadFormat,
  fileName: string
): Promise<string> {
  const TARGET_WIDTH = 1504;
  const TARGET_HEIGHT = 1007;

  // Temukan elemen gambar template asli di dalam card
  const imgElement = element.querySelector("img") as HTMLImageElement | null;
  const templateSrc = imgElement?.src || "/images/fallback-template.png";

  // Temukan teks nama yang dimasukkan
  const nameElement = element.querySelector("[data-card-name]") as HTMLElement | null;
  const rawText = nameElement?.innerText || "Dear Pahlawan Donor Darah,";

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Tidak dapat membuat 2D context pada Canvas."));
      return;
    }

    const templateImg = new Image();
    templateImg.crossOrigin = "anonymous";

    templateImg.onload = () => {
      // Pastikan render kanvas menggunakan smoothing kualitas tinggi (tidak ngeblur)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 1. Gambar background template penuh 1504 x 1007
      ctx.drawImage(templateImg, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

      // 2. Render teks "Dear [Nama]," di atas tulisan "Terima Kasih"
      // Posisi vertikal: antara pita "Care in Action" (~33%) dan "Terima Kasih" (~47%)
      // Posisi horizontal: sumbu tengah visual teks acara (~53.5% dari lebar kartu)
      const centerX = Math.round(TARGET_WIDTH * 0.535);
      const centerY = Math.round(TARGET_HEIGHT * 0.398);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Hitung ukuran font adaptif berdasarkan panjang teks
      const textLen = rawText.length;
      let fontSize = 28;
      if (textLen > 60) {
        fontSize = 18;
      } else if (textLen > 40) {
        fontSize = 21;
      } else if (textLen > 25) {
        fontSize = 24;
      }

      ctx.font = `700 ${fontSize}px "Montserrat", "Poppins", "Segoe UI", sans-serif`;

      // Efek bayangan halus agar teks selalu kontras dan terbaca jelas
      ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Warna merah marun elegan PTPN
      ctx.fillStyle = "#6B0F1A";

      // Jika teks panjang dan membutuhkan 2 baris (misal lebih dari 45 karakter)
      if (textLen > 45 && rawText.includes(" ")) {
        const words = rawText.split(" ");
        let line1 = "";
        let line2 = "";
        const half = Math.ceil(words.length / 2);
        line1 = words.slice(0, half).join(" ");
        line2 = words.slice(half).join(" ");

        const lineHeight = fontSize * 1.25;
        ctx.fillText(line1, centerX, centerY - lineHeight / 2);
        ctx.fillText(line2, centerX, centerY + lineHeight / 2);
      } else {
        ctx.fillText(rawText, centerX, centerY);
      }

      const mimeType = format === "jpg" ? "image/jpeg" : "image/png";
      const quality = format === "jpg" ? 1.0 : undefined;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      downloadDataUrl(dataUrl, fileName);
      resolve(dataUrl);
    };

    templateImg.onerror = () => {
      // Jika sumber gambar gagal (misal CORS atau Storage belum diupload), coba fallback lokal
      if (!templateImg.src.includes("/images/fallback-template.png")) {
        console.warn("Gagal memuat template dari remote URL, mencoba fallback template lokal...");
        templateImg.src = "/images/fallback-template.png";
      } else {
        reject(new Error("Gagal memuat template gambar untuk kanvas."));
      }
    };

    templateImg.src = templateSrc;
  });
}
