window.onload = function() {
  var root = document.getElementById("PSPDFKit-example");
  var items = [
    { type: "pager" },
    { type: "pan" },
    { type: "zoom-out" },
    { type: "zoom-in" },
    { type: "zoom-mode" },
    { type: "spacer" },
    { type: "ink" },
    { type: "text" }
  ];
  var viewState = new PSPDFKit.ViewState({
    viewportPadding: {
      horizontal: 0,
      vertical: 0
    }
  });

  var isWasm =
    typeof window.WebAssembly === "object" &&
    typeof window.WebAssembly.instantiate === "function";
  if (isWasm) {
    var el = document.getElementById("PSPDFKit-example-method");
    el.innerHTML = "WebAssembly ✅";
  }

  document.addEventListener(
    "keydown",
    function(event) {
      event.stopImmediatePropagation();
    },
    true
  );

  PSPDFKit.load({
    container: "#PSPDFKit-container",
    pdf: "/images/blog/2017/webassembly-a-new-hope/example.pdf",
    licenseKey:
      "oiO73AFmsV9G0wKabq4n3MdRtNqvakcOTogcw5MpjDTJGh7rL2wN9KRucSPwBMuAbL6I8vcaw2K4ug0A2Kfnuc_vNAYk6-JDknyOkYE4a3FiK15xi9ZB88Rn8SzkVJCqe5q1wD7_470q6t1wE-0qLm1tWCnIEBSJ1veVIwVetII1Tv1kyZLzc7AMR7lKcDGSKflOuumRV3DDW_uwrfEnGoHh8RylDd5vpK3HrSmY6TFmFSUPh03AFGGHWREMb7V_KTvxWUofnGUc1bqKpiWzvHrCd6fNp67-Zi2rbJ2XHrQfnLmXZFdoIhfufHgKhHniL55-hcBy5Moy-n9MTMhtW7nCYQCSQAg9KXDWSdwfaYhTO8JFfwc2hBCMiS24til2HZvqfQRK4eljTjbm_JQKDvnYST1qxTDnDiB49nZ4P4SBCZMH8J_3QdnW40OvDJOuz4P-lrC2lzU0zmWXXe2yw0pxy8wCwwikqIQu0zwnK8nJAyKFODAkLQ7WDsGyKjLQBnMsTkoQJaaA0h8eeldi6REfVrVY8AhILXBoB_otZKXk0u56nlzK5siSNtiJL913",
    toolbarItems: items,
    initialViewState: viewState,
    styleSheets: ["/images/blog/2017/webassembly-a-new-hope/custom.css"]
  }).catch(function() {
    root.parentNode.removeChild(root);
    var el = document.getElementById("PSPDFKit-example-onerror");
    el.style.display = "block";
  });
};
