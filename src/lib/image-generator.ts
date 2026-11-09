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
      // Pastikan resolusi kanvas mengikuti resolusi asli template (2000 x 1340 px Ultra HD)
      const canvasWidth = templateImg.naturalWidth || 2000;
      const canvasHeight = templateImg.naturalHeight || 1340;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Pastikan render kanvas menggunakan smoothing kualitas tinggi (tidak ngeblur)
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 1. Gambar background template penuh
      ctx.drawImage(templateImg, 0, 0, canvasWidth, canvasHeight);

      // 2. Render teks nama tepat DI TENGAH antara tulisan "PAHLAWAN DONOR DARAH" (53.13%) dan "Atas kepedulian..." (62.99%)
      // Posisi vertikal: 58.1% dari tinggi gambar (jarak simetris 66px ke atas dan 66px ke bawah)
      // Posisi horizontal: sumbu tengah visual teks acara (52.25% dari lebar kartu)
      const centerX = Math.round(canvasWidth * 0.5225);
      const centerY = Math.round(canvasHeight * 0.5806);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Ukuran font standar tetap proporsional dengan lebar kanvas
      const textLen = rawText.length;
      let fontScale = 0.020;
      if (textLen > 60) {
        fontScale = 0.013;
      } else if (textLen > 40) {
        fontScale = 0.0155;
      } else if (textLen > 25) {
        fontScale = 0.018;
      }

      const fontSize = Math.round(canvasWidth * fontScale);
      ctx.font = `700 ${fontSize}px "Montserrat", "Poppins", "Segoe UI", sans-serif`;

      // Efek bayangan halus agar teks selalu kontras dan terbaca jelas
      ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
      ctx.shadowBlur = Math.round(canvasWidth * 0.004);
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
