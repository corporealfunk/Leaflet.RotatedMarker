(function() {
    // save these original methods before they are overwritten
    var proto_initIcon = L.Marker.prototype._initIcon;
    var proto_setPos = L.Marker.prototype._setPos;

    var oldIE = (L.DomUtil.TRANSFORM === 'msTransform');

    L.Marker.addInitHook(function () {
        var iconOptions = this.options.icon && this.options.icon.options;
        var iconAnchor = iconOptions && this.options.icon.options.iconAnchor;
        if (iconAnchor) {
            iconAnchor = (iconAnchor[0] + 'px ' + iconAnchor[1] + 'px');
        }
        this.options.rotationOrigin = this.options.rotationOrigin || iconAnchor || 'center bottom' ;
        this.options.rotationAngle = this.options.rotationAngle || 0;

        // Ensure marker keeps rotated during dragging
        this.on('drag', function(e) { e.target._applyRotation(); });
    });

    L.Marker.include({
        _initIcon: function() {
            proto_initIcon.call(this);
        },

        _setPos: function (pos) {
            proto_setPos.call(this, pos);
            this._applyRotation();
        },

        _applyRotation: function () {
            if(this.options.rotationAngle) {
                this._icon.style[L.DomUtil.TRANSFORM+'Origin'] = this.options.rotationOrigin;

                if(oldIE) {
                    // for IE 9, use the 2D rotation
                    this._icon.style[L.DomUtil.TRANSFORM] = 'rotate(' + this.options.rotationAngle + 'deg)';
                } else {
                    // for modern browsers, prefer the 3D accelerated version
                    this._icon.style[L.DomUtil.TRANSFORM] += ' rotateZ(' + this.options.rotationAngle + 'deg)';
                }
            }
        },

        setRotationAngle: function(angle) {
            var oldRotationAngle = this.options.rotationAngle;
            var newRotationAngle = angle;
            var oldRotationOrigin = this.options.rotationOrigin;
            var newRotationOrigin = oldRotationOrigin;
            this.options.rotationAngle = newRotationAngle;
            this.update();
            this.fire('rotated', {
              oldRotationAngle,
              newRotationAngle,
              oldRotationOrigin,
              newRotationOrigin,
            });
            return this;
        },

        setRotationOrigin: function(origin) {
            var oldRotationAngle = this.options.rotationAngle;
            var newRotationAngle = oldRotationAngle;
            var oldRotationOrigin = this.options.rotationOrigin;
            var newRotationOrigin = origin;
            this.options.rotationOrigin = origin;
            this.update();
            this.fire('rotated', {
              oldRotationAngle,
              newRotationAngle,
              oldRotationOrigin,
              newRotationOrigin,
            });
            return this;
        }
    });
})();
