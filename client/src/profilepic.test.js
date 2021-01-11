import React from "react";
import ProfilePic from "./profilepic";
import { render, fireEvent } from "@testing-library/react";

test("When no URL is passed, a defult image is used", () => {
    const { container } = render(<ProfilePic />);
    // console.log("img", container.querySelector("img"));
    expect(container.querySelector("img").src.endsWith("/userdef.png")).toBe(
        true
    );
});

test("When URL is passed, a new image is used", () => {
    const { container } = render(<ProfilePic profile_pic="/hpaahoss.com" />);
    console.log("img src: ", container.querySelector("img").src);
    expect(container.querySelector("img").src.endsWith("/hpaahoss.com")).toBe(
        true
    );
});

test("When first and last props are passed, they got assigned to the value of alt", () => {
    const { container } = render(<ProfilePic first="bebo" last="dodo" />);
    console.log("img alt: ", container.querySelector("img").alt);
    expect(container.querySelector("img").alt).toBe("bebo dodo");
});

test("clicking on the image, the onclick will run", () => {
    const mockOnClick = jest.fn();
    const { container } = render(<ProfilePic onClick={mockOnClick} />);
    fireEvent.click(container.querySelector("img"));
    expect(mockOnClick.mock.calls.length).toBe(1);
});
