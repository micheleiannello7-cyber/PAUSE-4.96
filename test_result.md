#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Genera finché ti è possibile delle nuove copertine dove mancantiPoi dovresti riattivare le icone 3d che avevo creato per le categorie, non le vedo"
backend:
  - task: Restore original category 3D illustrations and generate missing covers
    implemented: true
    working: true
    file: backend/restore_category_art.py, backend/restore_generated_covers.py, backend/covers_sync.py
    stuck_count: 0
    priority: high
    needs_retesting: true
    status_history:
      - working: true
        agent: main
        comment: "Restored all 13 approved originals via --reupload; all media endpoints verified 200 WebP. Fixed empty Mongo projection misclassifying 8 local covers as unknown; all 8 imported. Created 60 new covers via creation-time image generation, 5 per category, with content-addressed hero/thumb variants and persistent source manifest. Runtime LLM batch stopped on exhausted budget (0 successes), no further runtime generation authorized during tests. 210 truly empty covers remain. Existing curated photos untouched."
frontend:
  - task: Show restored category art and story covers with image error fallback
    implemented: true
    working: true
    file: frontend/src/components/story-hero.tsx, frontend/src/api.ts
    stuck_count: 0
    priority: high
    needs_retesting: true
    status_history:
      - working: true
        agent: main
        comment: "Category delivery revision resets previously failed mounted images. StoryHero now falls back generated -> curated -> branded placeholder instead of blank. Added unique image/fallback test IDs. Screenshot verified restored 3D icons in onboarding and navigation to Home. Test report iteration 1 was migration only, now retest media."
metadata:
  created_by: main_agent
  version: "1.1"
  test_sequence: 2
  run_ui: true
test_plan:
  current_focus:
    - All 13 category endpoints and 68 story covers (60 new + 8 restored)
    - WebP hero/thumb dimensions, cache ETags, preservation of originals
    - Onboarding, Home category strip, Topics and story reader media
    - Import idempotence and StoryHero error fallback
  stuck_tasks: []
  test_all: false
  test_priority: high_first
agent_communication:
  - agent: main
    message: "Read memory/test_credentials.md. Anonymous app, no auth. Use preview URL from frontend/.env. Do NOT call TTS, image generation APIs or payments. Inspect generated_cover_sources.json for all 60 new IDs. Test metadata and actual image bytes via /api/media/<id>?size=hero|thumb. Missing paths must still 404. Screenshots at 390x844; no native device available."