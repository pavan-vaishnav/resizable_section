import React, { useRef, useEffect, useState, useCallback } from 'react';
import './App.css';

function App() {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [leftWidth, setLeftWidth] = useState(10); // percentage
  const [rightWidth, setRightWidth] = useState(10); // percentage
  const [headerHeight, setHeaderHeight] = useState(30); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null);
  const minMiddleWidth = 0; // percentage
  const minHeaderHeight = 5; // minimum header height in percentage
  const maxHeaderHeight = 30; // maximum header height in percentage
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;

    if (resizeType === 'header') {
      if (!headerRef.current) return;
      const containerHeight = window.innerHeight;
      const mouseY = e.clientY;
      const mousePercentage = (mouseY / containerHeight) * 100;
      const clampedHeight = Math.max(minHeaderHeight, Math.min(maxHeaderHeight, mousePercentage));
      setHeaderHeight(clampedHeight);
    } else if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      const mousePercentage = (mouseX / containerWidth) * 100;

      if (resizeType === 'left') {
        let newLeftWidth = Math.max(1, Math.min(100, mousePercentage));
        let newMiddleWidth = 100 - newLeftWidth - rightWidth;
        if (newMiddleWidth < minMiddleWidth) {
          let available = 100 - newLeftWidth - minMiddleWidth;
          let newRight = Math.max(2, available);
          setRightWidth(newRight);
          newMiddleWidth = 100 - newLeftWidth - newRight;
        }
        setLeftWidth(newLeftWidth);
      } else if (resizeType === 'right') {
        let newRightWidth = Math.max(1, Math.min(100, 100 - mousePercentage));
        let newMiddleWidth = 100 - leftWidth - newRightWidth;
        if (newMiddleWidth < minMiddleWidth) {
          let available = 100 - newRightWidth - minMiddleWidth;
          let newLeft = Math.max(2, available);
          setLeftWidth(newLeft);
          newMiddleWidth = 100 - newLeft - newRightWidth;
        }
        setRightWidth(newRightWidth);
      }
    }
  }, [isResizing, resizeType, leftWidth, rightWidth]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeType(null);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };

    const debouncedMouseMove = (e) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => handleMouseMove(e));
    };

    if (isResizing) {
      document.addEventListener('mousemove', debouncedMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      if (resizeType === 'header') {
        document.body.style.cursor = 'ns-resize';
      } else {
        document.body.style.cursor = 'ew-resize';
      }
      
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', debouncedMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isResizing, resizeType, handleMouseMove]);

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

  const handleHeaderResizerMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeType('header');
  };

  const middleWidth = 100 - leftWidth - rightWidth;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div 
        ref={headerRef}
        style={{
          height: `${headerHeight}%`,
          backgroundColor: '#f0f0f0',
          borderBottom: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          position: 'relative',
          flexShrink: 0,
          transition: 'height 0.1s ease-out'
        }}
      >
        Header Toolbar
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: 'transparent',
            cursor: 'ns-resize',
            zIndex: 10
          }}
          onMouseDown={handleHeaderResizerMouseDown}
        />
      </div>

      <div 
        ref={containerRef}
        style={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          height: `calc(100% - ${headerHeight}%)`
        }}
      >
        <div
          style={{
            width: `${leftWidth}%`,
            backgroundColor: '#e8f4f8',
            borderRight: '1px solid #ccc',
            padding: '16px',
            overflow: 'hidden'
          }}
        >
          {leftWidth > 2 && 'Left toolbar'}
        </div>

        <div
          style={{
            width: '4px',
            backgroundColor: '#ccc',
            cursor: 'ew-resize',
            position: 'relative',
            zIndex: 10
          }}
          onMouseDown={handleLeftResizerMouseDown}
        />

        <div
          style={{
            width: `${middleWidth}%`,
            backgroundColor: '#fff',
            padding: '16px',
            overflow: 'hidden'
          }}
        >
          {minMiddleWidth > 1 && 'Middle Content Area'}
        </div>

        <div
          style={{
            width: '4px',
            backgroundColor: '#ccc',
            cursor: 'ew-resize',
            position: 'relative',
            zIndex: 10
          }}
          onMouseDown={handleRightResizerMouseDown}
        />

        <div
          style={{
            width: `${rightWidth}%`,
            backgroundColor: '#f8f4e8',
            borderLeft: '1px solid #ccc',
            padding: '16px',
            overflow: 'hidden'
          }}
        >
          {rightWidth > 2 && 'Right toolbar'}
        </div>
      </div>
    </div>
  );
}

export default App;