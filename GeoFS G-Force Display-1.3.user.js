// ==UserScript==
// @name         GeoFS G-Force Display
// @namespace    GeoFS
// @match        https://www.geo-fs.com/geofs.php?v=3.9
// @grant        none
// @version      1.3
// @author       LJF
// @description  Displays current G-force in bottom-left corner of GeoFS, raised above utility bar
// ==/UserScript==

(function () {
    "use strict";

    // Wait for GeoFS to fully load
    function waitForGeoFS(callback) {
        const check = () => {
            if (typeof geofs !== "undefined" && geofs.animation?.values?.accZ !== undefined) {
                callback();
            } else {
                setTimeout(check, 500);
            }
        };
        check();
    }

    waitForGeoFS(() => {
        // Create G-force display element
        const gDisplay = document.createElement("div");
        gDisplay.id = "gForceDisplay";
        gDisplay.style.position = "fixed";
        gDisplay.style.bottom = "60px"; // raised to avoid overlap with UI
        gDisplay.style.left = "10px";
        gDisplay.style.fontSize = "20px";
        gDisplay.style.fontFamily = "monospace";
        gDisplay.style.color = "#00ff00";
        gDisplay.style.background = "rgba(0, 0, 0, 0.6)";
        gDisplay.style.padding = "8px 12px";
        gDisplay.style.borderRadius = "8px";
        gDisplay.style.zIndex = "99999";
        gDisplay.innerText = "G: 0.00";
        document.body.appendChild(gDisplay);

        // Update function
        function updateGForce() {
            const accZ = geofs?.animation?.values?.accZ;
            if (typeof accZ === "number") {
                const gForce = accZ / 9.80665;
                gDisplay.innerText = "G: " + gForce.toFixed(2);
            } else {
                gDisplay.innerText = "G: --";
            }

            requestAnimationFrame(updateGForce);
        }

        // Start updating
        requestAnimationFrame(updateGForce);
    });
})();
