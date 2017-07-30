
function XyGallery(id,option){
    var container = document.getElementById(id);
    if(container.className.indexOf('XyGallery') == -1)
        {container.className += ' xy-gallery';}

    var defaultOption = {
        defaultWidth: 130,
        defaultHeight: 40,
        activeWidth: 340,
        activeHeight: 400,
        animatDuration: 300
    }

    //设置默认参数
    option = Object.assign({}, defaultOption, option);
    //传入参数的异常处理
    if(option.width == undefined) throw "width not defined";
    if(option.height == undefined) throw "height not defined";
    if(option.width * option.height != container.children.length) throw "width and height not match children length.";
    
    //处理过渡未完成的bug，用延时函数。
    var lastRunTime = new Date(0);  //不传参数是当前时间，传0是1970年早上8点
    var runId = 0;

    var activePicture = function(index){
        clearTimeout(runId);
        var currentTime = new Date(); 
        //如果当前时间减去上一次执行的时间小于过渡时间，则延迟0.3秒再执行，return个id回去
        if(currentTime - lastRunTime < option.animatDuration){
            runId = setTimeout(function(){
                activePicture(index);
            }, option.animatDuration);
            return;
        }
        lastRunTime = currentTime;
        
        //根据索引取得当前的active的坐标
        var cx = index % option.width;
        var cy = Math.floor(index / option.width);
        //设置父元素的宽高
        container.style.width = (option.width -1) * option.defaultWidth + option.activeWidth + option.width + "px";
        //遍历所有图片，
        for(var y = 0; y < option.height; y++){
            for(var x = 0; x < option.width; x++){
                //将坐标转换为索引，取到该节点
                var cindex = y * option.width + x;
                var item = container.children[cindex];
                //根据四种位置来设置宽高，激活的，同列的，同行的，不同行不同列
                if(x == cx && y == cy){
                    item.className = "active";
                    item.style.width = option.activeWidth + "px";
                    item.style.height = option.activeHeight + "px";
                }else if(x == cx){
                    item.className = "";
                    item.style.width = option.activeWidth + "px";
                    item.style.height = option.defaultHeight + "px";
                }else if(y == cy){
                    item.className = "";
                    item.style.width = option.defaultWidth + "px";
                    item.style.height = option.activeHeight + "px";
                }else{
                    item.className = "";
                    item.style.width = option.defaultWidth + "px";
                    item.style.height = option.defaultHeight + "px";
                }
            }

        }
    }
    //默认第一个active状态
    activePicture(0);

    //绑定鼠标事件，用mouseenter代替mouseover
    // for(var i=0; i<container.children.length; i++){
    //     var item = container.children[i];
    //     item.addEventListener('mouseenter',(function(i){ 
    //         return function(evt){
    //         activePicture(i);
    //         }
    //     })(i))
    // }

    //另一种更好的方法,
    Array.prototype.forEach.call(container.children, function(o,i){
        o.addEventListener('mouseenter',function(evt){
            activePicture(i);
        })
    })

    //返回一个方法出去，里面的东西外面访问不到
    return {
        active: activePicture
    }
}