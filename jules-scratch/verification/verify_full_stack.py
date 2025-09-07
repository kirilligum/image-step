from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    """
    This script verifies the full stack application, from frontend to backend API.
    """
    # 1. Navigate to the application
    page.goto("http://localhost:5173/")
    page.wait_for_load_state('networkidle')

    # 2. Find the textarea and input a project description
    instruction_input = page.get_by_placeholder("e.g., How to assemble a 10x20 EMT shade structure for Burning Man...")
    expect(instruction_input).to_be_visible()
    instruction_input.fill("How to build a simple wooden birdhouse")

    # 3. Click the generate button
    page.get_by_role("button", name="Generate Instructions").click()

    # 4. Wait for the loading to complete and instructions to appear.
    # The API calls can be slow, so we use a long timeout.
    loading_indicator = page.get_by_role("heading", name="Generating your instructions... Please wait.")
    expect(loading_indicator).to_be_visible(timeout=10000)
    # The full end-to-end generation can take a long time.
    expect(loading_indicator).to_be_hidden(timeout=180000) # 3 minute timeout

    # 5. Assert that the results are displayed
    overview_heading = page.locator("h2").nth(1)
    expect(overview_heading).to_be_visible()
    expect(overview_heading).not_to_have_text("") # Ensure it's not empty

    # Check that at least one image has been generated and is visible
    first_image = page.locator(".generated-image").first
    expect(first_image).to_be_visible()

    # 6. Take a screenshot for visual verification
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()
