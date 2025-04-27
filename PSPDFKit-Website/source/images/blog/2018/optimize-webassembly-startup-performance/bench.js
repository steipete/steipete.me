(function () {
  let instance = null
  const container = document.querySelector('#bench')
  container.addEventListener('click', start)
  function start() {
    container.innerHTML = render(null)
    appendBundle(container)
  }

  function load(container) {
    const startTime = Date.now()
    if (instance) {
      PSPDFKit.unload(instance)
      instance = null
    }
    PSPDFKit.load({
      container: "#pspdfkit-bench-container",
      pdf: "/images/blog/2017/webassembly-a-new-hope/example.pdf",
      licenseKey:
        "lOcUyLx8aTTfRVptflfyYPyHAfxPuczR5odvTsWU64pFDX9ICZGaSlX_clsC_uSqSU_LDMJ3Dx6fz2-GbYcKC-Q1_ItHOGBsW5TN7dJPamGfYhMaVggnFofoUAzspDQjI45spMljTqE7nYV5ORp7YklYaqIOKVl4mjO6u49LikocqF_JBwy66NMXg0JeWBv4FzyFQU2cpEvnsAOmY28xxgYToG-y1TCVP8qrovYTAo1AbV_VDC1tf-f8X_h6QY2MdyWpa2SWTKhAs3RZblmsfch4y5tk9uC-7tFqDGwqatWGd62XJgYrv7gKnNXJmYCBDzWAXTdevj8K7Wv58UsdINmj2vy1676s2aDZg0WjcQPF3_pFxU00qgtEhRnE4jNM24Ak8MrSF13LgXU9LAcBRb4jMi--ZShakxeGdC6tRyV7oCyt94dSeteKupT_JB5i5Zw5MExsQAg6vOVBGq3lPw_1J5pjVylWPfUD2njyNzxnTjkMUjSwCTIptdhPy110mBPr2pFtt8Xq0gihKURXeHS9B3XSj-Knpm41fdMcr8lUAnDYl2oroQ1Y5VnSdN2CZD7e-JWkzp3vABoAt2VZNrvNC2fIjiS2rPSQDO8OV9dAMQWUk5Kwkjonj7p9SCozMPs830_VrPcOQxojukN9xNy26M8Tb4tAGain8pAvPzQ=",
      headless: true,
    }).then(function (i) {
      instance = i
      container.innerHTML = render(Date.now() - startTime)
    }).catch(function() {
      container.innerHTML = `<p style="color: red">😞 Something went wrong. PSPDFKit for Web wasn't able to load.<p> <button>retry</button>`
    })
  }

  function render(result) {
    return `
      <p style="margin-bottom: 0">${result ? '' : 'Loading '}PSPDFKit for Web</p>
      <div style="background: #eee; height: 0.5em; width: 50%; border-radius: 2px; overflow: hidden">
        <div style="background: #3c97fe; height: 100%; width: ${result ? 100 : 20}%"></div>
      </div>
      <div id="pspdfkit-bench-container"></div>
      ${result ? `<p style="margin-top: 0.3em">took ${result}ms to load.</p><button>Try again</button>` : ''}
    `
  }

  function appendBundle(container) {
    if (document.querySelector('#pspdfkit-bench-js')) {
      load(container)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://web-preview-server.pspdfkit.com/pspdfkit.js'
    script.id = 'pspdfkit-bench-js'
    script.onload = function () {
      load(container)
    }
    const head = document.head || document.head[0]
    head.appendChild(script)
  }
}())
