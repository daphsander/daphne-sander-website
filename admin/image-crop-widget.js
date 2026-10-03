const ImageCropControl = createClass({
  handlePick: async function () {
    const picked = await this.props.pickFile({ kind: "image" });

    if (picked) {
      const value = this.props.value;
      this.props.onChange({
        src: picked.value,
        x: value && typeof value === "object" && Number.isFinite(value.x) ? value.x : 50,
        y: value && typeof value === "object" && Number.isFinite(value.y) ? value.y : 50,
      });
    }
  },

  handlePointerDown: function (event) {
    const frame = event.currentTarget;
    const image = frame.querySelector("img");
    if (!image || !image.complete || !image.naturalWidth) return;

    const bounds = frame.getBoundingClientRect();
    const scale = Math.max(
      bounds.width / image.naturalWidth,
      bounds.height / image.naturalHeight,
    );
    this.dragStart = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      x: this.getPosition("x"),
      y: this.getPosition("y"),
      overflowX: image.naturalWidth * scale - bounds.width,
      overflowY: image.naturalHeight * scale - bounds.height,
    };
    frame.setPointerCapture(event.pointerId);
  },

  handlePointerMove: function (event) {
    const drag = this.dragStart;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const clamp = (value) => Math.max(0, Math.min(100, value));
    this.props.onChange({
      src: this.getSource(),
      x: drag.overflowX
        ? clamp(drag.x - ((event.clientX - drag.clientX) / drag.overflowX) * 100)
        : drag.x,
      y: drag.overflowY
        ? clamp(drag.y - ((event.clientY - drag.clientY) / drag.overflowY) * 100)
        : drag.y,
    });
  },

  handlePointerEnd: function (event) {
    if (this.dragStart && this.dragStart.pointerId === event.pointerId) {
      this.dragStart = null;
    }
  },

  getSource: function () {
    const value = this.props.value;
    return value && typeof value === "object" ? value.src : value;
  },

  getPosition: function (axis) {
    const value = this.props.value;
    const position = value && typeof value === "object" ? value[axis] : 50;
    return Number.isFinite(position) ? position : 50;
  },

  render: function () {
    const src = this.getSource();
    const asset = src ? this.props.getAsset(src) : undefined;
    const imageUrl = asset && asset.url;
    const position = `${this.getPosition("x")}% ${this.getPosition("y")}%`;
    const frameStyle = {
      width: "100%",
      maxWidth: "420px",
      aspectRatio: "4 / 3",
      overflow: "hidden",
      touchAction: "none",
      cursor: "grab",
      background: "#efede7",
      marginBottom: "8px",
    };

    return h("div", {},
      h("button", {
        type: "button",
        onClick: this.handlePick,
      }, src ? "Bild auswählen/ändern" : "Bild auswählen"),
      imageUrl && h("div", {
        style: frameStyle,
        onPointerDown: this.handlePointerDown,
        onPointerMove: this.handlePointerMove,
        onPointerUp: this.handlePointerEnd,
        onPointerCancel: this.handlePointerEnd,
        title: "Bild ziehen, um den sichtbaren Ausschnitt anzupassen",
      },
      h("img", {
        src: imageUrl,
        alt: "Vorschau des 4:3-Bildausschnitts",
        draggable: false,
        style: {
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          pointerEvents: "none",
          userSelect: "none",
        },
      })),
      imageUrl && h("small", {}, "Bild ziehen, um den sichtbaren Ausschnitt festzulegen."),
    );
  },
});

if (!window.CMS) {
  throw new Error("Sveltia CMS API is unavailable; image crop control was not registered.");
}

window.CMS.registerFieldType("imageCrop", ImageCropControl);
