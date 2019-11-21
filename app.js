//첫번재로 할일은 누군가가 마우스를 캔버스에 두면 감지하였으면 좋겠다.
//ndn으로 canvas에 대해 알아보기.
/*캔버스는 기본적으로 html요소인데
  특별한 점은 context를 갖는다는 것이다.
  컨텍스트는 이요소에 우리가 픽셀에 접근할 수 있는 것.
  const ctx = canvas.getContext("2d"); 
  즉 ctx.lineWidth = 10;
  이것은 컨텍스트로 라인을 그리는 것.
  */
const canvas = document.getElementById("jsCanvas");
const colors = document.getElementsByClassName("jsColor");
//캔버스는 기본적으로 css에서 다루는 캔버스 사이즈랑
//js에서 다룰 캔버스 사이즈가 필요하다.
//pixel을 다룰수있는 element로서 만드는 것이므로 width와 height를 지정해줘야한다.
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");//이건 , fill누르면 paint로, paint누르면 fill로 가게.
const saveBtn = document.getElementById("jsSave");

canvas.width = 500;
canvas.height = 500;


let painting = false;
let filling = false;
const ctx = canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(0, 0, 500, 500);
// 위의 두개는 기본 설정을 하지 않으면, 저장했을때 배경설정이 안되있어서 투명하게 나옴.
ctx.strokeStyle = "#2c2c2c";
ctx.lineWidth = 2.5;
ctx.fillStyle = "#2c2c2c";
//strokestyle은 색상이나 스타일을 라인에 사용할 수 있다.
//지금 위의 문장으로 default값 초기화하는 것. 검정색으로.
//ctx.fillStyle = "green"; 사각형 채우기
//ctx.fillRect(50,20,100,49); 사각형 영역 만들기

function startPainting(){
    painting = true;
}

function stopPainting(){
    painting = false;
}
function onMouseMove(event){
    //event중 관심있는건 offset
    //offset은 캔버스 부분과 관련있는 것
    //client x,y는 윈도우 전체의 범위내에서 마우스 위치 값
    //캔버스 내의 좌표만 있으면 된다.
    //offset만 보면 된다.
    //만약 캔버스가 윈도우 전체사이즈일 경우, client x,y와 offset x,y는 같은 값일 것
    const x = event.offsetX;
    const y = event.offsetY;
    //context는 path가 있다. 기본적인 라인을 의미함.
    //path를 움직일 수 있고, path를 색으로 칠할 수도 있음
    //path는 그냥 선이다.
    //path에 대해 좀더 알아보기.
    if(!painting){
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else{
        ctx.lineTo(x,y);
        // 현재 sub-path의 마지막 점을 특정 좌표와 직선으로 연결한다.
        ctx.stroke();
        //이 lineTo와 stroke는 내가 클릭한 순간부터 끝날때까지 이어지는 선을 의미하는게 아니라
        // 매순간순간 마우스를 움직일때마다 발생하는 것
        //ctx.closePath()는 말그대로 path를 닫는것.
        //시작점은 항상 처음 if안에 있는 x,y가 된다.
    }
}

//우리가 해야하는 건 마우스를 캔버스에서 클릭하면, 그때부터 인지했으면 좋겠다

function onMouseLeave(event){
    stopPainting();
}


function handleColorClick(event){
    const color = event.target.style.backgroundColor;
    console.log(color);
    ctx.strokeStyle = color;
    ctx.fillStyle = color; //fill을 누른건 아니지만 미리 fillstyle은 바꿔놓는다!
}

function handleRangeChange(event){
    const size = event.target.value;
    ctx.lineWidth = size;
}

function handleModeClick(){
    if(filling === true) {
        filling = false;
        mode.innerText = "FILL";
    }else{
        filling = true;
        mode.innerText = "PAINT";
    }
}

function handleCanvasClick(){
    if(filling) {
        ctx.fillRect(0,0,500,500);
    }
}

function handleRightClick(event){
    event.preventDefault();
    //우클릭 방지기능이 된다.
}

function handleSaveClick(event){
    //save버튼 누르면 그린 것들을 다 넣고, image안에 그것을 담는다.
    //canvasElement.toDataUrl
    //기본적으로 png 설정된 type parameter에 의해
    //저장된 포맷의 이미지 표현을 포함한 data URI를 반환함
    //PNG가 될 수 있고 바꿀 수 있음
    const image = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = image;
    link.download = "PaintJS[EXPORT]";
    link.click();
}

if(canvas){
    canvas.addEventListener("mousemove", onMouseMove);
    //mousedown은 클릭하고 손을떼지 않을 때이다.
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("touchmove", onMouseMove);
    canvas.addEventListener("touchstart", startPainting);
    canvas.addEventListener("mouseup",stopPainting);
    canvas.addEventListener("touchend",startPainting);
    canvas.addEventListener("mouseleave",onMouseLeave);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleRightClick);
}

Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick));

if(range){
    range.addEventListener("input", handleRangeChange);
}

if(mode){
    mode.addEventListener("click",handleModeClick);
}

if(saveBtn){
    saveBtn.addEventListener("click",handleSaveClick);
}