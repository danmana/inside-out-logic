(function (doc, NS, svg) {
    var $ = function (selector) {
        return document.querySelectorAll(selector);
    };


    function draw() {
        var L = Number($('#size')[0].value);
        //pentagon height
        var H = L * Math.sqrt(5 + 2 * Math.sqrt(5)) / 2;
        //half of the cube side
        var X = L * (1 + Math.sqrt(9 + 4 * Math.sqrt(5))) / 4;
        //the trapezoid angle
        var ALPHA = Math.asin(X / H) * 180 / Math.PI;
        var SIN36 = Math.sin(Math.PI / 5);
        var COS36 = Math.cos(Math.PI / 5);
        var SIN72 = Math.sin(2 * Math.PI / 5);
        var COS72 = Math.cos(2 * Math.PI / 5);
        var COLOR = "black";


        var pentaFace = [
            [0, 0],
            [-L / 2, 0],
            [-L / 2 - L * COS72, -L * SIN72],
            [0, -L * SIN72 - L * SIN36]
        ];

        var cubeFace = [
            [0, 0],
            [0, L / 2],
            [X, X],
            [X, 0]
        ];

        var pentaFace2 = [
            [0, 0],
            [L / 2, 0],
            [L / 2 + L * COS72, -L * SIN72],
            [0, -L * SIN72 - L * SIN36]
        ];

        var triangle = [
            [0, 0],
            [0, -X],
            [X - L / 2, -X]
        ];

        var square = [
            [0, 0],
            [0, -X],
            [-X, -X],
            [-X, 0]
        ];

        function poly(vertices) {
            var points = [], i;

            for (i = 0; i < vertices.length; i++) {
                points.push(vertices[i][0] + "," + vertices[i][1]);
            }

            points.push("0,0");

            var poly = doc.createElementNS(NS, "polyline");
            poly.setAttribute("fill", "none");
            poly.setAttribute("stroke", COLOR);
            poly.setAttribute("points", points.join(" "));

            return poly;
        }

        function shape1() {
            var shape = doc.createElementNS(NS, "g");

            //create
            var p1 = poly(pentaFace);
            var p2 = poly(pentaFace);
            var p3 = poly(pentaFace);
            var p4 = poly(cubeFace);
            var p5 = poly(cubeFace);
            var p6 = poly(cubeFace);
            var g = doc.createElementNS(NS, "g");

            //transform
            var rX = pentaFace[2][0];
            var rY = pentaFace[2][1];

            p2.setAttribute("transform", "rotate(-108 " + rX + " " + rY + ")");
            p3.setAttribute("transform", "rotate(108 " + rX + " " + rY + ")");

            rX = cubeFace[2][0];
            p5.setAttribute("transform", "rotate(-90 " + rX + " 0)");
            p6.setAttribute("transform", "rotate(180 " + rX + " 0)");

            g.setAttribute("transform", "rotate(" + ALPHA + " 0 " + (pentaFace[3][1]) + ") translate(0 " + (pentaFace[3][1] - L / 2) + ")");

            //append
            shape.appendChild(p1);
            shape.appendChild(p2);
            shape.appendChild(p3);
            g.appendChild(p4);
            g.appendChild(p5);
            g.appendChild(p6);
            shape.appendChild(g);

            return shape;
        }

        function shape2Part() {
            var shape = doc.createElementNS(NS, "g");

            var p1 = poly(pentaFace2);
            var p2 = poly(triangle);
            var p3 = poly(square);


            p2.setAttribute("transform", "rotate(-" + (90 - ALPHA) + " 0 0)");
            p3.setAttribute("transform", "rotate(-" + (90 - ALPHA) + " 0 0)");


            shape.appendChild(p1);
            shape.appendChild(p2);
            shape.appendChild(p3);

            return shape;
        }

        function shape2() {
            var shape = doc.createElementNS(NS, "g");

            //create
            var p1 = shape2Part();
            var p2 = shape2Part();
            var p3 = shape2Part();

            //transform
            p2.setAttribute("transform", "rotate(108 " + pentaFace2[2][0] + " " + pentaFace2[2][1] + ")");
            p3.setAttribute("transform", "rotate(216 " + pentaFace2[2][0] + " " + pentaFace2[2][1] + ")");


            //append
            shape.appendChild(p1);
            shape.appendChild(p2);
            shape.appendChild(p3);

            return shape;
        }

        function cleanSVG(svg, scaleX, scaleY){
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
            svg.setAttribute('width', L * scaleX);
            svg.setAttribute('height', L * scaleY);
        }

        var svg1 = $('#svg1')[0];
        var svg2 = $('#svg2')[0];

        function drawSideBySide(){
            var s1 = shape1();
            var s2 = shape2();

            s1.setAttribute("transform", "translate(" + 2.25 * L + " " + 2.25 * L + ")");
            s2.setAttribute("transform", "translate(" + 5 * L + " " + 4 * L + ")");

            cleanSVG(svg1,8.5,5);
            svg1.appendChild(s1);
            svg1.appendChild(s2);
            svg2.style.display = 'none';
        }

        function drawOneByOne(){
            var s1 = shape1();
            var s2 = shape2();
            s1.setAttribute("transform", "translate(" + 2.25 * L + " " + 2.25 * L + ")");
            s2.setAttribute("transform", "translate(" + 2.25 * L + " " + 3.75 * L + ")");

            cleanSVG(svg1,5,3);
            cleanSVG(svg2,6,4.5);
            svg1.appendChild(s1);
            svg2.appendChild(s2);
            svg2.style.display = 'block';
        }

        function drawTwoByTwo(){
            var s11 = shape1();
            var s12 = shape1();
            var s21 = shape2();
            var s22 = shape2();

            s11.setAttribute("transform", "translate(" + 2.25 * L + " " + 2.25 * L + ")");
            s12.setAttribute("transform", "translate(" + 6.75 * L + " " + 2.25 * L + ")");
            s21.setAttribute("transform", "translate(" + 2 * L + " " + 3.75 * L + ") rotate(30 " +pentaFace2[2][0] + " " + pentaFace2[2][1] + ")");
            s22.setAttribute("transform", "translate(" + 6.25 * L + " " + 3.75 * L + ") rotate(30 " +pentaFace2[2][0] + " " + pentaFace2[2][1] + ")");

            cleanSVG(svg1,9.5,3);
            cleanSVG(svg2,9.5,5.25);
            svg1.appendChild(s11);
            svg1.appendChild(s12);
            svg2.appendChild(s21);
            svg2.appendChild(s22);
            svg2.style.display = 'block';


        }


        if ($('#side-by-side')[0].checked) {
            drawSideBySide();
        } else if ($('#one-by-one')[0].checked) {
            drawOneByOne();
        } else if ($('#two-by-two')[0].checked) {
            drawTwoByTwo();
        }


    }

    var triggers = $('input'), i;
    for (i = 0; i < triggers.length; i++) {
        triggers[i].addEventListener('change', draw);
    }

    draw();


}(document, "http://www.w3.org/2000/svg"));