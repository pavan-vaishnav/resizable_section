import React, { useRef, useEffect, useState } from 'react';
import './App.css';

function App() {
  const containerRef = useRef(null);
  const [leftWidth, setLeftWidth] = useState(10); // percentage
  const [rightWidth, setRightWidth] = useState(10); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null);
  const minMiddleWidth = 0; // for example, 10%

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      const mousePercentage = (mouseX / containerWidth) * 100;

      if (resizeType === 'left') {
        let newLeftWidth = Math.max(4, Math.min(100, mousePercentage));
        let newMiddleWidth = 100 - newLeftWidth - rightWidth;
        if (newMiddleWidth < minMiddleWidth) {
          // Shrink right panel if possible
          let available = 100 - newLeftWidth - minMiddleWidth;
          let newRight = Math.max(4, available);
          setRightWidth(newRight);
          newMiddleWidth = 100 - newLeftWidth - newRight;
        }
        setLeftWidth(newLeftWidth);
      } else if (resizeType === 'right') {
        let newRightWidth = Math.max(4, Math.min(100, 100 - mousePercentage));
        let newMiddleWidth = 100 - leftWidth - newRightWidth;
        if (newMiddleWidth < minMiddleWidth) {
          // Shrink left panel if possible
          let available = 100 - newRightWidth - minMiddleWidth;
          let newLeft = Math.max(4, available);
          setLeftWidth(newLeft);
          newMiddleWidth = 100 - newLeft - newRightWidth;
        }
        setRightWidth(newRightWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeType(null);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeType]);

  const handleLeftResizerMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeType('left');
  };

  const handleRightResizerMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeType('right');
  };

  const middleWidth = 100 - leftWidth - rightWidth;

  return (
    <div className="main">
      <div className="header">
        Header Toolbar
      </div>

      <div className="main-div" ref={containerRef}>
        <div
          className="left"
          style={{ width: `${leftWidth}%` }}
        >
          {leftWidth > 4 && 'Left toolbar'}
        </div>

        <div
          className="resizer-left"
          onMouseDown={handleLeftResizerMouseDown}
        />

        <div
          className="middle"
          style={{ width: `${middleWidth}%` }}
        >

        </div>

        <div
          className="resizer-right"
          onMouseDown={handleRightResizerMouseDown}
        />

        <div
          className="right"
          style={{ width: `${rightWidth}%` }}
        >
          {rightWidth > 4   && 'Right toolbar'}
        </div>
      </div>
    </div>
  );
}

export default App;