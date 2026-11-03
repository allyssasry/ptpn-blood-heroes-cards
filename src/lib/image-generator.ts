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
 * Mengutamakan Canvas 2D Engine dengan resolusi kanvas tetap 1504 × 1007 piksel
 * agar hasil unduhan di smartphone (layar kecil) dan laptop/PC memiliki ukuran font
 * dan ketajaman yang 100% identik dan tidak terpengaruh ukuran layar perangkat.
 */
export async function exportCardAsImage(
  element: HTMLElement,
  format: DownloadFormat,
  fileName: string,
  options?: ExportOptions
): Promise<string> {
  try {
    return await exportCardViaCanvas(element, format, fileName);
  } catch (canvasError) {
    console.warn("Canvas export mengalami kendala, beralih ke html-to-image:", canvasError);

    // Fallback cadangan menggunakan html-to-image
    const { toPng, toJpeg } = await import("html-to-image");
    const pixelRatio = options?.pixelRatio ?? 2;
    const quality = options?.quality ?? 1.0;

    const exportConfig = {
      cacheBust: true,
      pixelRatio,
      quality,
      backgroundColor: "#FFFFFF",
      filter: (node: HTMLElement) => {
        if (node.classList && node.classList.contains("no-export")) {
          return false;
        }
        return true;
      },
    };

    let dataUrl: string;
    if (format === "jpg") {
      dataUrl = await toJpeg(element, exportConfig);
    } else {
      dataUrl = await toPng(element, exportConfig);
    }

    downloadDataUrl(dataUrl, fileName);
    return dataUrl;
  }
}

/**
 * High-Definition Generator menggunakan Native HTML5 Canvas 2D
 * Memastikan hasil download selalu berukuran tepat 1504 × 1007 piksel
 * dengan ukuran font tetap yang proporsional, baik dibuka di smartphone maupun PC.
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

  // Temukan teks nama yang dimasukkan (misal: "Sdr. Budi" atau "Sdri. Siti")
  const nameElement = element.querySelector("[data-card-name]") as HTMLElement | null;
  const rawText = nameElement?.innerText || "Sdr. Pahlawan Donor Darah";

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

      // 2. Render teks nama di bawah tulisan "PAHLAWAN DONOR DARAH" dan di atas "Setetes darah..."
      // Posisi vertikal: 58.2% dari tinggi 1007px (~586px)
      // Posisi horizontal: sumbu tengah visual teks acara (53.5% dari lebar kartu = 805px)
      const centerX = Math.round(TARGET_WIDTH * 0.535);
      const centerY = Math.round(TARGET_HEIGHT * 0.582);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Ukuran font standar tetap yang seimbang untuk resolusi kartu 1504 x 1007
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
      ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
      ctx.shadowBlur = 8;
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
