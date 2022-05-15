let buttonOpen = document.getElementById("buttonOpen");
let textAreaDebugger = document.getElementById("textAreaDebugger");

if ("serial" in navigator) {
  console.log("serialPort supported!!");
  buttonOpen.addEventListener("click", async () => {
    const port = await navigator.serial.requestPort();
    const ports = await navigator.serial.getPorts();
    console.log(`-->Ports:`, ports);
    await port.open({ baudRate: 115200 });
    const reader = port.readable.getReader();

    setInterval(async function () {
      let response = await reader.read();
      if (
        response.value[0] == 27 &&
        response.value[1] == 91 &&
        response.value[2] == 75
      ) {
        //Backspace response from micropython repl
        textAreaDebugger.value = textAreaDebugger.value.slice(0, -2);
      } else {
        let data = "";
        for (let i = 0; i < response.value.length; i++) {
          data += String.fromCharCode(response.value[i]);
        }
        textAreaDebugger.value += data;
        textAreaDebugger.scrollTop = textAreaDebugger.scrollHeight;
      }
    }, 10);

    textAreaDebugger.addEventListener("keypress", async function (event) {
      console.log(event.keyCode);
      const writer = port.writable.getWriter();
      const data = new Uint8Array([event.keyCode]);
      await writer.write(data);
      writer.releaseLock();
    });

    textAreaDebugger.addEventListener("keydown", async function (event) {
      //console.log(event.keyCode);
      if (event.keyCode == 8) {
        const writer = port.writable.getWriter();
        const data = new Uint8Array([event.keyCode]);
        await writer.write(data);
        writer.releaseLock();
      }
    });
  });
}
