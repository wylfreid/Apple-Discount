import * as React from "react"
import { Dialog } from "@headlessui/react"
import { motion, AnimatePresence } from "framer-motion"

import '../../styles/modal.css'

export const Modal = ({ isOpen, setIsOpen }) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<Dialog
					open={isOpen}
					onClose={setIsOpen}
					as="div"
					className="fixed inset-0 z-10 flex items-center justify-center overflow-y-auto"
					onClick={() => setIsOpen(false)}
				>
					<div className="flex flex-col py-8 px-4 text-center">
						<Dialog.Overlay />
						<div
							className="fixed inset-0 transition-opacity"
							aria-hidden="true"
						>
							<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
						</div>

						<motion.div
							className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
							initial={{
								opacity: 0,
								scale: 0,
							}}
							animate={{
								opacity: 1,
								scale: 1,
								transition: {
									ease: "easeOut",
									duration: 0.15,
								},
							}}
							exit={{
								opacity: 0,
								scale: 0.75,
								transition: {
									ease: "easeIn",
									duration: 0.15,
								},
							}}
						>
							<span
								className="hidden sm:inline-block sm:align-middle sm:h-screen"
								aria-hidden="true"
							>
								&#8203;
							</span>

							<div
								className="rounded-circle modal-dialog modal-lg modal-dialog-centered modal__infos" 
								role="document"
								aria-modal="true"
								aria-labelledby="modal-headline"
							>
							<div className="modal-content card bg-white mx-auto">
            <div
              type="button"
              className="close  position-absolute text-end fs-1"
              data-dismiss="modal"
              aria-label="Close"
              style={{ right: 10, top: 0, zIndex: 1000 }}
            >
              <span aria-hidden="true">&times;</span>
            </div>
            <div className="modal-body p-3">
              <div className="text-justify mt-3 mb-3 ps-2">
                <h6 style={{lineHeight: "30px"}}>For customized products, please contact customer service via the message button. You can also write to us on <span className="fw-bold text-dark"> <a href="https://instagram.com/apple_discount_237?igshid=YmMyMTA2M2Y=">Instagram</a></span>, we are available 24 hours a day, 7 days a week.</h6>
              </div>

          
            </div>
          </div>
							</div>
						</motion.div>
					</div>
				</Dialog>
			)}
		</AnimatePresence>
	)
}
