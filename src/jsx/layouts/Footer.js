import React from "react";

const Footer = () => {
	var d = new Date();
	return (
		<div className="footer">
			<div className="copyright border-top">
				<p>Copyright © Designed &amp; Developed by{" "}
					<a href="http://dexignlab.com/" target="_blank"  rel="noreferrer">
						Snap
					</a>{" "}
					{d.getFullYear()}
				</p>
			</div>
		</div>
	);
};

export default Footer;
