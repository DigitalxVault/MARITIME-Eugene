{
  "themeName": "mission-control-life-support",
  "description": "Dark sci-fi mission control dashboard inspired by life support UI screenshot. High-contrast cyan/teal accents on deep navy background, with square condensed fonts and tight uppercase headings.",
  "palette": {
    "background": "#0F1D3B",
    "backgroundAlt": "#0B253B",
    "panel": "#0C2441",
    "panelAlt": "#091B33",
    "border": "#2C4C73",
    "dividerStrong": "#4AA0C9",
    "dividerSoft": "#273D5C",
    "primary": "#76F4F3",
    "primarySoft": "rgba(118,244,243,0.22)",
    "accentGreen": "#8CFF4F",
    "accentBlue": "#4FB5FF",
    "danger": "#FF4058",
    "warning": "#FFC857",
    "success": "#8CFF4F",
    "textPrimary": "#FFFFFF",
    "textSecondary": "#A6C2E5",
    "textMuted": "#6F89AF",
    "textDim": "#496186",
    "labelSubtle": "#5FAAD0",
    "gridLine": "#1A3755",
    "chipBackground": "#0F2948",
    "chipActive": "#1C3B66",
    "statusOn": "#8CFF4F",
    "statusOff": "#59759A",
    "chartBarPrimary": "#76F4F3",
    "chartBarSecondary": "#4FB5FF",
    "chartLinePrimary": "#8CFF4F",
    "chartLineSecondary": "#76F4F3",
    "scrollTrack": "#0A172B",
    "scrollThumb": "#274063"
  },
  "typography": {
    "fontFamilyPrimary": "\"Rajdhani\", \"Orbitron\", system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    "fontFamilyMono": "\"Share Tech Mono\", \"JetBrains Mono\", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace",
    "baseFontSize": "14px",
    "lineHeights": {
      "tight": 1.1,
      "normal": 1.3,
      "relaxed": 1.5
    },
    "sizes": {
      "xs": "10px",
      "sm": "12px",
      "md": "14px",
      "lg": "18px",
      "xl": "24px",
      "xxl": "32px"
    },
    "weights": {
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "letterSpacing": {
      "capsTight": "0.18em",
      "capsNormal": "0.12em",
      "body": "0.02em",
      "numeric": "0.08em"
    },
    "usage": {
      "pageTitle": {
        "fontFamily": "fontFamilyPrimary",
        "fontSize": "32px",
        "fontWeight": "700",
        "letterSpacing": "0.18em",
        "textTransform": "uppercase"
      },
      "sectionTitle": {
        "fontFamily": "fontFamilyPrimary",
        "fontSize": "20px",
        "fontWeight": "600",
        "letterSpacing": "0.14em",
        "textTransform": "uppercase"
      },
      "metricValue": {
        "fontFamily": "fontFamilyMono",
        "fontSize": "28px",
        "fontWeight": "600",
        "letterSpacing": "0.08em"
      },
      "metricUnit": {
        "fontFamily": "fontFamilyPrimary",
        "fontSize": "12px",
        "fontWeight": "500",
        "letterSpacing": "0.18em",
        "textTransform": "uppercase"
      },
      "label": {
        "fontFamily": "fontFamilyPrimary",
        "fontSize": "11px",
        "fontWeight": "500",
        "letterSpacing": "0.18em",
        "textTransform": "uppercase"
      },
      "body": {
        "fontFamily": "fontFamilyPrimary",
        "fontSize": "14px",
        "fontWeight": "400",
        "letterSpacing": "0.02em"
      },
      "caption": {
        "fontFamily": "fontFamilyPrimary",
        "fontSize": "11px",
        "fontWeight": "400",
        "letterSpacing": "0.12em",
        "textTransform": "uppercase"
      }
    }
  },
  "layout": {
    "grid": {
      "columnGap": "16px",
      "rowGap": "16px",
      "panelRadius": "2px",
      "panelPadding": "16px",
      "panelHeaderHeight": "28px"
    },
    "page": {
      "maxWidth": "1440px",
      "paddingX": "24px",
      "paddingY": "24px",
      "sidebarWidth": "260px",
      "topBarHeight": "56px"
    },
    "borders": {
      "thin": "1px solid",
      "strong": "2px solid"
    },
    "shadows": {
      "panelGlow": "0 0 0 1px rgba(118,244,243,0.15)",
      "panelInset": "inset 0 0 0 1px rgba(39,61,92,0.95)"
    }
  },
  "components": {
    "panel": {
      "background": "panel",
      "borderColor": "border",
      "borderStyle": "solid",
      "borderWidth": "1px",
      "header": {
        "fontStyle": "sectionTitle",
        "color": "textPrimary",
        "bottomBorderColor": "dividerSoft",
        "bottomBorderWidth": "1px"
      }
    },
    "metricCard": {
      "background": "panelAlt",
      "borderColor": "dividerSoft",
      "valueColor": "primary",
      "unitColor": "textSecondary",
      "labelColor": "labelSubtle"
    },
    "chart": {
      "background": "panelAlt",
      "axisColor": "gridLine",
      "labelColor": "textMuted",
      "linePrimary": "chartLinePrimary",
      "lineSecondary": "chartLineSecondary",
      "barPrimary": "chartBarPrimary",
      "barSecondary": "chartBarSecondary"
    },
    "table": {
      "headerBackground": "panelAlt",
      "headerTextColor": "textSecondary",
      "rowStripeBackground": "#0B213C",
      "rowHoverBackground": "#132846",
      "borderColor": "dividerSoft"
    },
    "statusLight": {
      "size": "8px",
      "onColor": "statusOn",
      "offColor": "statusOff",
      "borderColor": "#02101F"
    },
    "tag": {
      "background": "chipBackground",
      "activeBackground": "chipActive",
      "textColor": "textSecondary",
      "textTransform": "uppercase",
      "fontSize": "10px",
      "letterSpacing": "0.18em"
    },
    "buttonPrimary": {
      "background": "primary",
      "textColor": "#00111A",
      "borderRadius": "2px",
      "fontWeight": "600",
      "letterSpacing": "0.18em",
      "textTransform": "uppercase"
    },
    "buttonGhost": {
      "background": "transparent",
      "textColor": "primary",
      "borderColor": "primary",
      "borderWidth": "1px",
      "borderRadius": "2px"
    },
    "input": {
      "background": "#07162B",
      "borderColor": "dividerSoft",
      "textColor": "textPrimary",
      "placeholderColor": "textMuted",
      "focusBorderColor": "primary"
    }
  }
}
