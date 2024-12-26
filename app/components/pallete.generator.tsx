import React from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ColorPalette() {
  const generatePalette = (primaryColor) => {
    const hexToHsl = (hex) => {
      let r = parseInt(hex.slice(1, 3), 16) / 255;
      let g = parseInt(hex.slice(3, 5), 16) / 255;
      let b = parseInt(hex.slice(5, 7), 16) / 255;

      let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h *= 60;
      }
      return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
    };

    const hslToHex = (h, s = 100, l = 50) => {
      l /= 100;
      const a = (s / 100) * Math.min(l, 1 - l);

      const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, "0");
      };

      return `#${f(0)}${f(8)}${f(4)}`;
    };

    const adjustHue = (h, degree) => (h + degree + 360) % 360;

    const primaryHsl = hexToHsl(primaryColor);

    // Generate Accent Shades
    const generateShades = (baseHsl) => {
      const shades = {};
      for (let i = 1; i <= 9; i++) {
        const lightness = Math.max(5, Math.min(95, baseHsl.l + (i - 5) * 10));
        shades[`Accent ${i * 100}`] = hslToHex(baseHsl.h, baseHsl.s, lightness);
      }
      return shades;
    };

    // Generate Color Schemes
    const analogous = [
      hslToHex(adjustHue(primaryHsl.h, -30), primaryHsl.s, primaryHsl.l),
      hslToHex(adjustHue(primaryHsl.h, 30), primaryHsl.s, primaryHsl.l),
    ];
    const triadic = [
      hslToHex(adjustHue(primaryHsl.h, 120), primaryHsl.s, primaryHsl.l),
      hslToHex(adjustHue(primaryHsl.h, 240), primaryHsl.s, primaryHsl.l),
    ];
    const split = [
      hslToHex(adjustHue(primaryHsl.h, 150), primaryHsl.s, primaryHsl.l),
      hslToHex(adjustHue(primaryHsl.h, 210), primaryHsl.s, primaryHsl.l),
    ];

    const colorResponse = {
      primary: primaryColor,
      split: hslToHex(adjustHue(primaryHsl.h, 180), primaryHsl.s, primaryHsl.l),
      ...generateShades(primaryHsl),
      analogous,
      triadic,
      splitCont: split,
    };

    return colorResponse;
  };

  const [primaryColor, setPrimaryColor] = React.useState("#fed142");
  const palette = generatePalette(primaryColor);

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    toast.success(`Copied ${hex} to clipboard!`);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <Toaster />
      <h1>Color Palette Generator</h1>
      <input
        type="color"
        value={primaryColor}
        onChange={(e) => setPrimaryColor(e.target.value)}
        style={{ margin: "10px 0", padding: "5px" }}
      />
      <h2>Primary Color: {primaryColor}</h2>
      <br />
      <hr />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem", margin: "20px 0" }}>
        {Object.keys(palette)
          .filter((key) => key.startsWith("Accent"))
          .map((key) => (
            <div key={key} style={{ textAlign: "center", cursor: "pointer" }} onClick={() => copyToClipboard(palette[key])}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: palette[key],
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                {palette[key]}
              </div>
              <p>{key}</p>
            </div>
          ))}
      </div>
      <br />
      <hr />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem", margin: "20px 0" }}>
        {["analogous", "triadic", "splitCont"].map((scheme) =>
          palette[scheme].map((color, index) => (
            <div key={`${scheme}-${index}`} style={{ textAlign: "center", cursor: "pointer" }} onClick={() => copyToClipboard(color)}>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: color,
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                {color}
              </div>
              <p>{scheme} {index + 1}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
