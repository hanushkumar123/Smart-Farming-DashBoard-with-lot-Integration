import React from 'react';

const Card = ({ children, className = '', title, subtitle, actions }) => {
    return (
        <div className={`card ${className}`}>
            {(title || subtitle || actions) && (
                <div className="flex items-center justify-between mb-4 border-b border-border-light pb-4 -mx-6 px-6">
                    <div>
                        {title && <h3 className="text-lg font-medium text-text-primary">{title}</h3>}
                        {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
                    </div>
                    {actions && <div className="flex gap-2">{actions}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
